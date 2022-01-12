package com.ec.datavismobile;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {

    private WebView webview;
    private String db_url = "http://cluster.earlham.edu:9900/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button dbButton = (Button)findViewById(R.id.dbButton);
        dbButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                showAddItemDialog(MainActivity.this);
            }
        });

        webview =(WebView)findViewById(R.id.webView);

        webview.setWebViewClient(new WebViewClient());
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setDomStorageEnabled(true);
        webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        loadUrl(MainActivity.this, db_url);


    }
    private void loadUrl(Context c, String url){
        System.out.println("Loading Webpage...");
        webview.loadUrl(url);
    }
    private void showAddItemDialog(Context c) {
        final EditText taskEditText = new EditText(c);
        AlertDialog dialog = new AlertDialog.Builder(c)
                .setTitle("Enter a new Database URL")
                .setMessage("Default: http://cluster.earlham.edu:9900/\nCurrent: " + db_url)
                .setView(taskEditText)
                .setPositiveButton("Connect", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        db_url = String.valueOf(taskEditText.getText());
                        loadUrl(MainActivity.this, db_url);
                    }
                })
                .setNegativeButton("Cancel", null)
                .create();
        dialog.show();
    }
}
