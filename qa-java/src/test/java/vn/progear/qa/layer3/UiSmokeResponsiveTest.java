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
        if (QaConfig.javaTarget()) {
            visible(By.id("qa-search-input"));
            visible(By.id("qa-product-grid"));
            List<WebElement> products = driver.findElements(By.cssSelector("[data-testid='product-card']"));
            assertFalse(products.isEmpty(), "No Java storefront product cards rendered");
        } else {
            visible(By.cssSelector("[data-testid='search-input']"));
            List<WebElement> products = driver.findElements(By.cssSelector("[data-testid='product-card']"));
            assertFalse(products.isEmpty(), "No product cards rendered");
        }
        assertNoHorizontalOverflow();
    }

    @Test
    void storefrontRendersResponsivelyOnMobile() {
        open(new Dimension(390, 844), "/");
        visible(QaConfig.javaTarget() ? By.id("qa-search-input") : By.cssSelector("[data-testid='btn-cart-drawer']"));
        assertNoHorizontalOverflow();
    }

    @Test
    void adminLoginRendersWithoutAuthenticating() {
        open(new Dimension(1366, 768), QaConfig.javaTarget() ? "/admin/login" : "/admin/");
        if (QaConfig.javaTarget()) {
            visible(By.xpath("//*[contains(normalize-space(.), 'Đăng nhập nhân viên')]"));
            WebElement form = visible(By.cssSelector("vaadin-login-form"));
            assertEquals("Tài khoản nhân viên", form.getAttribute("title"));
            assertFalse(driver.getPageSource().contains("TẠO TÀI KHOẢN KHÁCH HÀNG"),
                    "Staff portal must not expose customer registration");
        } else {
            visible(By.cssSelector("[data-testid='admin-login-screen']"));
            visible(By.cssSelector("[data-testid='input-admin-email']"));
            visible(By.cssSelector("[data-testid='btn-admin-login-submit']"));
        }
        assertNoHorizontalOverflow();
    }

    @Test
    void customerLoginAndRegistrationRenderSeparately() {
        if (!QaConfig.javaTarget()) return;
        open(new Dimension(1366, 768), "/dang-nhap");
        visible(By.id("qa-login-screen"));
        visible(By.id("qa-login-form"));
        WebElement form = driver.findElement(By.id("qa-login-form"));
        assertEquals("Tài khoản khách hàng", form.getAttribute("title"));
        visible(By.xpath("//*[contains(normalize-space(.), 'Đăng ký thành viên')]"));
        assertFalse(driver.getPageSource().contains("Cổng nội bộ"),
                "Customer portal must not contain staff-login copy");
        assertNoHorizontalOverflow();
    }

    @Test
    void protectedCustomerOrdersRedirectAnonymousUserToCustomerLogin() {
        if (!QaConfig.javaTarget()) return;
        open(new Dimension(1366, 768), "/my-orders");
        new WebDriverWait(driver, QaConfig.timeout()).until(webDriver ->
                webDriver.getCurrentUrl().contains("/dang-nhap"));
        assertTrue(driver.getCurrentUrl().contains("/dang-nhap"), driver.getCurrentUrl());
    }

    @Test
    void protectedCustomerOrderDetailRedirectsAnonymousUserToCustomerLogin() {
        if (!QaConfig.javaTarget()) return;
        open(new Dimension(390, 844), "/tai-khoan/don-hang/QA-NOT-A-REAL-ORDER");
        new WebDriverWait(driver, QaConfig.timeout()).until(webDriver ->
                webDriver.getCurrentUrl().contains("/dang-nhap"));
        assertTrue(driver.getCurrentUrl().contains("/dang-nhap"), driver.getCurrentUrl());
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

    private WebElement visible(By locator) {
        return new WebDriverWait(driver, QaConfig.timeout()).until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    private void assertNoHorizontalOverflow() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        long scrollWidth = ((Number) js.executeScript("return document.documentElement.scrollWidth")).longValue();
        long clientWidth = ((Number) js.executeScript("return document.documentElement.clientWidth")).longValue();
        assertTrue(scrollWidth <= clientWidth + 2,
                () -> "Horizontal overflow: scrollWidth=" + scrollWidth + ", clientWidth=" + clientWidth);
    }
}
