package vn.progear.qa.layer3;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import vn.progear.qa.support.QaConfig;

@Tag("ephemeral-writes")
class EphemeralCommerceUiTest {
    private WebDriver driver;

    @AfterEach
    void captureAndClose() throws IOException {
        if (driver == null) return;
        Path artifacts = Path.of("target", "ephemeral-artifacts");
        Files.createDirectories(artifacts);
        Files.write(artifacts.resolve("final.png"), ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES));
        Files.writeString(artifacts.resolve("page.html"), driver.getPageSource());
        driver.quit();
    }

    @Test
    void customerRegistersLogsInChecksOutTracksAndCancels() {
        assumeTrue(QaConfig.ephemeralWritesEnabled(), "Writes require explicit localhost ephemeral stack");
        open("/dang-nhap");
        String suffix = Long.toString(Instant.now().toEpochMilli());
        String email = "browser-qa+" + suffix + "@example.invalid";
        String password = "QaBrowser!" + suffix;

        setValue("customer-register-name", "Browser QA");
        setValue("customer-register-email", email);
        setValue("customer-register-password", password);
        setValue("customer-register-confirmation", password);
        click("customer-register-submit");
        waitUntil(webDriver -> value("customer-register-email").isEmpty());

        visible(By.cssSelector("#qa-login-form input[name='username']")).sendKeys(email);
        visible(By.cssSelector("#qa-login-form input[name='password']")).sendKeys(password);
        Boolean submitted = (Boolean) js().executeScript("""
                const login = document.querySelector('#qa-login-form');
                if (!login || typeof login.submit !== 'function') return false;
                login.submit();
                return true;
                """);
        assertTrue(Boolean.TRUE.equals(submitted), "Native login form was not available");
        waitUntil(webDriver -> "/".equals(URI.create(webDriver.getCurrentUrl()).getPath()));
        visible(By.id("qa-product-grid"));
        visible(By.cssSelector("[data-testid='btn-quick-add-cart']")).click();
        click("cart-drawer-button");
        setValue("checkout-recipient-name", "Browser QA");
        setValue("checkout-email", email);
        setValue("checkout-phone", "0900000000");
        setValue("checkout-address", "QA EPHEMERAL ONLY");
        click(By.xpath("//*[@id='checkout-payment-method']//vaadin-radio-button[.//span[normalize-space()='COD']]"));
        click(By.id("checkout-confirmation"));
        click("checkout-submit");

        WebElement successDialog = new WebDriverWait(driver, QaConfig.timeout()).until(webDriver ->
                webDriver.findElements(By.cssSelector("vaadin-dialog-overlay")).stream()
                        .filter(WebElement::isDisplayed)
                        .filter(element -> element.getText().contains("Đặt hàng thành công"))
                        .findFirst().orElse(null));
        String text = successDialog.getText();
        assertTrue(text.contains("Đặt hàng thành công"), text);
        String orderNumber = text.lines().filter(line -> line.contains("JAVA-")).findFirst()
                .map(line -> line.substring(line.indexOf("JAVA-")).trim()).orElseThrow();

        driver.get(QaConfig.uri("/tai-khoan/don-hang/" + orderNumber).toString());
        visible(By.id("customer-order-summary"));
        visible(By.id("customer-order-timeline"));
        click("customer-order-cancel");
        setValue("customer-order-cancel-reason", "QA ephemeral cleanup");
        click("customer-order-cancel-confirm");
        waitUntil(webDriver -> webDriver.getPageSource().contains("Đã hủy"));
        assertFalse(driver.getCurrentUrl().contains("dang-nhap"));
    }

    private void open(String path) {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,900");
        driver = new ChromeDriver(options);
        driver.manage().window().setSize(new Dimension(1440, 900));
        driver.get(QaConfig.uri(path).toString());
        waitUntil(webDriver -> "complete".equals(js().executeScript("return document.readyState")));
    }

    private WebElement visible(By locator) {
        return new WebDriverWait(driver, QaConfig.timeout()).until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    private void click(String id) { click(By.id(id)); }

    private void click(By locator) {
        WebElement element = new WebDriverWait(driver, QaConfig.timeout())
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        js().executeScript("arguments[0].scrollIntoView({block:'center'});", element);
        new WebDriverWait(driver, QaConfig.timeout()).until(ExpectedConditions.elementToBeClickable(element)).click();
    }

    private void setValue(String id, String value) {
        WebElement input = visible(By.cssSelector("#" + id + " input, #" + id + " textarea"));
        input.sendKeys(Keys.chord(Keys.CONTROL, "a"), value, Keys.TAB);
    }

    private String value(String id) {
        return visible(By.cssSelector("#" + id + " input, #" + id + " textarea")).getAttribute("value");
    }

    private void waitUntil(java.util.function.Function<WebDriver, Boolean> condition) {
        new WebDriverWait(driver, QaConfig.timeout()).until(condition);
    }

    private JavascriptExecutor js() { return (JavascriptExecutor) driver; }
}
