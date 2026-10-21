import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

const cookieExtractor = (request: any): string | null => {
  const cookie = request?.headers?.cookie;
  if (!cookie) return null;
  const entry = cookie.split(';').map((part: string) => part.trim()).find((part: string) => part.startsWith('progear_session='));
  return entry ? decodeURIComponent(entry.slice('progear_session='.length)) : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ||
        (process.env.NODE_ENV !== 'production' ? 'camera-local-development-only-secret' : undefined),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, fullName: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
