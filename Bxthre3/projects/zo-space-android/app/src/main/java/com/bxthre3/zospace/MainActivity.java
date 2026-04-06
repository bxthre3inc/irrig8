package com.bxthre3.zospace;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.bxthre3.zospace.ota.OTAUpdateManager;

public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private OTAUpdateManager otaManager;
    
    private static final String TARGET_URL = "https://brodiblanco.zo.space";
    
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        swipeRefresh = findViewById(R.id.swiperefresh);
        
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString("ZoSpace-Android/1.0.0");
        
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                swipeRefresh.setRefreshing(false);
            }
        });
        
        swipeRefresh.setOnRefreshListener(() -> webView.reload());
        swipeRefresh.setColorSchemeResources(
            android.R.color.holo_purple,
            android.R.color.holo_blue_dark
        );
        
        webView.loadUrl(TARGET_URL);
        
        // OTA Update Check
        otaManager = new OTAUpdateManager(this);
        otaManager.checkForUpdate();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (otaManager != null) {
            otaManager.unregister();
        }
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
