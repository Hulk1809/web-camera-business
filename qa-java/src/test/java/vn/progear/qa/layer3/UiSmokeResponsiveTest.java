package vn.progear.qa.layer3;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import vn.progear.qa.support.QaConfig;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer3")
class UiSmokeResponsiveTest {
    private WebDriver driver;

    @AfterEach
    void closeBrowser() {
        if (driver != null) driver.quit();
    }

    @Test
    void storefrontRendersOnDesktop() {
        open(new Dimension(1440, 900), "/");
        visible(By.cssSelector("[data-testid='search-input']"));
        List<WebElement> products = driver.findElements(By.cssSelector("[data-testid='product-card']"));
        assertFalse(products.isEmpty(), "No product cards rendered");
        assertNoHorizontalOverflow();
    }

    @Test
    void storefrontRendersResponsivelyOnMobile() {
        open(new Dimension(390, 844), "/");
        visible(By.cssSelector("[data-testid='btn-cart-drawer']"));
        assertNoHorizontalOverflow();
    }

    @Test
    void adminLoginRendersWithoutAuthenticating() {
        open(new Dimension(1366, 768), "/admin/");
        visible(By.cssSelector("[data-testid='admin-login-screen']"));
        visible(By.cssSelector("[data-testid='input-admin-email']"));
        visible(By.cssSelector("[data-testid='btn-admin-login-submit']"));
        assertNoHorizontalOverflow();
    }

    private void open(Dimension size, String path) {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size="
                + size.getWidth() + "," + size.getHeight());
        String binary = System.getenv("QA_CHROME_BINARY");
        if (binary != null && !binary.isBlank()) options.setBinary(binary);
        String driverPath = System.getenv("QA_CHROMEDRIVER");
        if (driverPath != null && !driverPath.isBlank()) System.setProperty("webdriver.chrome.driver", driverPath);
        driver = new ChromeDriver(options); // Selenium Manager resolves a driver outside the Docker image.
        driver.manage().window().setSize(size);
        driver.get(QaConfig.uri(path).toString());
        new WebDriverWait(driver, QaConfig.timeout()).until(webDriver ->
                "complete".equals(((JavascriptExecutor) webDriver).executeScript("return document.readyState")));
    }

    private void visible(By locator) {
        new WebDriverWait(driver, QaConfig.timeout()).until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    private void assertNoHorizontalOverflow() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        long scrollWidth = ((Number) js.executeScript("return document.documentElement.scrollWidth")).longValue();
        long clientWidth = ((Number) js.executeScript("return document.documentElement.clientWidth")).longValue();
        assertTrue(scrollWidth <= clientWidth + 2,
                () -> "Horizontal overflow: scrollWidth=" + scrollWidth + ", clientWidth=" + clientWidth);
    }
}
