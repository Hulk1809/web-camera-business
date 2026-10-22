FROM maven:3.9.9-eclipse-temurin-21

# Ubuntu's chromium packages are Snap launchers and do not work in a container.
# Install Google's deb package; Selenium Manager resolves its matching driver.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates gnupg wget \
    && wget -qO- https://dl.google.com/linux/linux_signing_key.pub \
       | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" \
       > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
ENV QA_CHROME_BINARY=/usr/bin/google-chrome
ENTRYPOINT ["mvn"]
CMD ["test"]
