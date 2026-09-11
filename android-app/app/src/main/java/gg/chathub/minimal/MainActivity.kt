package gg.chathub.minimal

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * WebView shell that opens official AI sites (Claude, ChatGPT, Gemini…)
 * so the user can sign in with their own account — no API keys.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val homeUrl = "file:///android_asset/www/index.html"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        webView.setBackgroundColor(Color.parseColor("#0b0d12"))
        setContentView(webView)

        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.javaScriptCanOpenWindowsAutomatically = true
        settings.setSupportMultipleWindows(false)
        settings.userAgentString =
            settings.userAgentString.replace("; wv", "") + " ChatHubMinimal/1.47"

        WebView.setWebContentsDebuggingEnabled(true)

        webView.addJavascriptInterface(Bridge(), "AndroidBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                // Keep navigation inside this WebView
                return false
            }
        }
        webView.webChromeClient = WebChromeClient()

        webView.loadUrl(homeUrl)
    }

    inner class Bridge {
        @JavascriptInterface
        fun openUrl(url: String) {
            runOnUiThread {
                webView.loadUrl(url)
            }
        }

        @JavascriptInterface
        fun openHome() {
            runOnUiThread {
                webView.loadUrl(homeUrl)
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (this::webView.isInitialized && webView.canGoBack()) {
            val current = webView.url ?: ""
            // If we left a site and can go back to home, do that
            if (current.startsWith("http") && !webView.canGoBack()) {
                webView.loadUrl(homeUrl)
            } else {
                webView.goBack()
            }
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }
}
