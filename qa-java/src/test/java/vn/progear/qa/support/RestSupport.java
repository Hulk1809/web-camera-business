package vn.progear.qa.support;

import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;

public final class RestSupport {
    private RestSupport() {}

    public static RequestSpecification request() {
        RequestSpecification request = RestAssured.given()
                .baseUri(QaConfig.baseUri().toString())
                .accept("application/json")
                .header("User-Agent", "ProGear-External-QA/1.0")
                .redirects().follow(false);
        return QaConfig.allowInsecureTls() ? request.relaxedHTTPSValidation() : request;
    }
}
