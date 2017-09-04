package com.christopherdro.htmltopdf;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.util.UUID;
import java.util.HashSet;
import java.util.Set;
import java.nio.charset.Charset;

import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.codec.Base64;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.text.FontFactory;
import com.itextpdf.tool.xml.XMLWorkerFontProvider;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.BaseFont;

import android.graphics.Typeface;
import android.os.Environment;

public class RNHTMLtoPDFModule extends ReactContextBaseJavaModule {

  private Promise promise;
  private final ReactApplicationContext mReactContext;
  private Set<String> customFonts = new HashSet<>();

  XMLWorkerFontProvider fontProvider = new XMLWorkerFontProvider(XMLWorkerFontProvider.DONTLOOKFORFONTS);

  public RNHTMLtoPDFModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNHTMLtoPDF";
  }

  @ReactMethod
  public void convert(final ReadableMap options, final Promise promise) {
    try {
      File destinationFile;
      String htmlString = options.hasKey("html") ? options.getString("html") : null;
      if (htmlString == null) return;

      String fileName;
      if (options.hasKey("fileName")) {
        fileName = options.getString("fileName");
      } else {
        fileName = UUID.randomUUID().toString();
      }

      if (options.hasKey("fonts")) {
        if (options.getArray("fonts") != null) {
          final ReadableArray fonts = options.getArray("fonts");
          for (int i = 0; i < fonts.size(); i++) {
            customFonts.add(fonts.getString(i));
          }
        }
      }

      if (options.hasKey("directory") && options.getString("directory").equals("docs")) {
        File path = new File(Environment.getExternalStorageDirectory(), Environment.DIRECTORY_DOCUMENTS);
        if (!path.exists()) path.mkdir();
        destinationFile = new File(path, fileName + ".pdf");
      } else {
        destinationFile = getTempFile(fileName);
      }

      String filePath = convertToPDF(htmlString, destinationFile);
      String base64 = "";

      if (options.hasKey("base64") && options.getBoolean("base64") == true) {
        base64 = Base64.encodeFromFile(filePath);
      }

      WritableMap resultMap = Arguments.createMap();
      resultMap.putString("filePath", filePath);
      resultMap.putString("base64", base64);

      promise.resolve(resultMap);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  private String convertToPDF(String htmlString, File file) throws Exception {
    try {
      Document doc = new Document();
      InputStream in = new ByteArrayInputStream(htmlString.getBytes());

      PdfWriter pdf = PdfWriter.getInstance(doc, new FileOutputStream(file));

      FontFactory.setFontImp(fontProvider);
      String fontChu = "";
      for (String font : customFonts) {
        fontProvider.register( font );
        fontChu = font;
      }

      File fontFile = new File(fontChu);
//      Typeface tf = Typeface.createFromAsset(mReactContext.getAssets(), "fonts/vuarial.ttf");

      BaseFont bf = BaseFont.createFont(fontChu, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      Font font = new Font(bf,15);
      doc.open();
      doc.add(new Paragraph("Đại học bách khoa Hà Nội", font));
      doc.add(new Paragraph("Vous \u00eates d'o\u00f9?", font));
      doc.add(new Paragraph("công ty cổ phần kim khí hóa chất cát tường", font));
      doc.add(new Paragraph("Vous \u00eates d'o\u00f9?", font));
      doc.add(new Paragraph("\u00c0 tout \u00e0 l'heure. \u00c0 bient\u00f4t.", font));
      doc.add(new Paragraph("Je me pr\u00e9sente.", font));
      doc.add(new Paragraph("C'est un \u00e9tudiant.", font));
      doc.add(new Paragraph("\u00c7a va?", font));
      doc.add(new Paragraph("Il est ing\u00e9nieur. Elle est m\u00e9decin.", font));
      doc.add(new Paragraph("C'est une fen\u00eatre.", font));
      doc.add(new Paragraph("R\u00e9p\u00e9tez, s'il vous pla\u00eet.", font));
      doc.add(new Paragraph("Odkud jste?", font));
      doc.add(new Paragraph("Uvid\u00edme se za chvilku. M\u011bj se.", font));
      doc.add(new Paragraph("Dovolte, abych se p\u0159edstavil.", font));
      doc.add(new Paragraph("To je studentka.", font));
      doc.add(new Paragraph("V\u0161echno v po\u0159\u00e1dku?", font));
      doc.add(new Paragraph("On je in\u017een\u00fdr. Ona je l\u00e9ka\u0159.", font));
      doc.add(new Paragraph("Toto je okno.", font));
      doc.add(new Paragraph("Zopakujte to pros\u00edm.", font));
      doc.add(new Paragraph("\u041e\u0442\u043a\u0443\u0434\u0430 \u0442\u044b?", font));
      doc.add(new Paragraph("\u0423\u0432\u0438\u0434\u0438\u043c\u0441\u044f \u0432 \u043d\u0435\u043c\u043d\u043e\u0433\u043e. \u0423\u0432\u0438\u0434\u0438\u043c\u0441\u044f.", font));
      doc.add(new Paragraph("\u041f\u043e\u0437\u0432\u043e\u043b\u044c\u0442\u0435 \u043c\u043d\u0435 \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044c\u0441\u044f.", font));
      doc.add(new Paragraph("\u042d\u0442\u043e \u0441\u0442\u0443\u0434\u0435\u043d\u0442.", font));
      doc.add(new Paragraph("\u0425\u043e\u0440\u043e\u0448\u043e?", font));
      doc.add(new Paragraph("\u041e\u043d \u0438\u043d\u0436\u0435\u043d\u0435\u0440. \u041e\u043d\u0430 \u0434\u043e\u043a\u0442\u043e\u0440.", font));
      doc.add(new Paragraph("\u042d\u0442\u043e \u043e\u043a\u043d\u043e.", font));
      doc.add(new Paragraph("\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435, \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430.", font));
      doc.close();
      in.close();

      String absolutePath = file.getAbsolutePath();

      return absolutePath;
    } catch (Exception e) {
      throw new Exception(e);
    }
  }

  private File getTempFile(String fileName) throws Exception {
    try {
      File outputDir = getReactApplicationContext().getCacheDir();
      File outputFile = File.createTempFile("PDF_" + UUID.randomUUID().toString(), ".pdf", outputDir);

      return outputFile;

    } catch (Exception e) {
      throw new Exception(e);
    }
  }

}






package com.christopherdro.htmltopdf;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.util.UUID;
import java.util.HashSet;
import java.util.Set;
import java.nio.charset.Charset;

import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.codec.Base64;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.text.FontFactory;
import com.itextpdf.tool.xml.XMLWorkerFontProvider;
import com.itextpdf.tool.xml.css.CssFile;
import com.itextpdf.tool.xml.css.StyleAttrCSSResolver;
import com.itextpdf.tool.xml.html.CssAppliers;
import com.itextpdf.tool.xml.html.CssAppliersImpl;
import com.itextpdf.tool.xml.html.Tags;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.PdfWriterPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;

import android.os.Environment;
import android.util.Log;

public class RNHTMLtoPDFModule extends ReactContextBaseJavaModule {

  private Promise promise;
  private final ReactApplicationContext mReactContext;
  private Set<String> customFonts = new HashSet<>();
  private String htmlFilePath = "";
  XMLWorkerFontProvider fontProvider = new XMLWorkerFontProvider(XMLWorkerFontProvider.DONTLOOKFORFONTS);

  public RNHTMLtoPDFModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNHTMLtoPDF";
  }

  @ReactMethod
  public void convert(final ReadableMap options, final Promise promise) {
    try {
      File destinationFile;

      String htmlString = options.hasKey("html") ? options.getString("html") : null;
      Log.i(htmlString, "htmlString: ");

      htmlFilePath = options.hasKey("htmlFilePath") ? options.getString("htmlFilePath") : null;
      Log.i(null, "htmlFilePath = " + htmlFilePath);

      String fileName;
      if (options.hasKey("fileName")) {
        fileName = options.getString("fileName");
      } else {
        fileName = UUID.randomUUID().toString();
      }
      Log.i(fileName, "fileName: ");

      if (options.hasKey("fonts")) {
        if (options.getArray("fonts") != null) {
          final ReadableArray fonts = options.getArray("fonts");
          for (int i = 0; i < fonts.size(); i++) {
            customFonts.add(fonts.getString(i));
          }
        }
      }


      if (options.hasKey("directory") && options.getString("directory").equals("docs")) {
        File path = new File(Environment.getExternalStorageDirectory(), Environment.DIRECTORY_DOCUMENTS);
        if (!path.exists()) path.mkdir();
        destinationFile = new File(path, fileName + ".pdf");
      } else {
        destinationFile = getTempFile(fileName);
      }

      String filePath = convertToPDF(htmlString, destinationFile);

      Log.i(filePath, "filePath: ");

      String base64 = "";

      if (options.hasKey("base64") && options.getBoolean("base64") == true) {
        base64 = Base64.encodeFromFile(filePath);
      }

      WritableMap resultMap = Arguments.createMap();
      resultMap.putString("filePath", filePath);
      resultMap.putString("base64", base64);

      promise.resolve(resultMap);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  private String convertToPDF(String htmlString, File file) throws Exception {
    try {
      Document doc = new Document();

      PdfWriter writer = PdfWriter.getInstance(doc, new FileOutputStream(file));
      InputStream in = new ByteArrayInputStream(htmlString.getBytes());

      FontFactory.setFontImp(fontProvider);
      for (String font : customFonts) {
        fontProvider.register(font, "VU Arial");
      }

      doc.open();
      Log.i(null, "open doc: ");
      // CSS
      CSSResolver cssResolver = new StyleAttrCSSResolver();
      CssFile cssFile = XMLWorkerHelper.getCSS(new ByteArrayInputStream("body {font-family: VU Arial}".getBytes()));
      cssResolver.addCss(cssFile);

      Log.i(null, "css define: ");

      CssAppliers cssAppliers = new CssAppliersImpl(fontProvider);
      HtmlPipelineContext htmlContext = new HtmlPipelineContext(cssAppliers);
      htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
      Log.i(null, "css applied: ");
      // Pipelines
      PdfWriterPipeline pdf = new PdfWriterPipeline(doc, writer);



      HtmlPipeline html = new HtmlPipeline(htmlContext, pdf);
      Log.i(html.toString(), "html: ");

      CssResolverPipeline css = new CssResolverPipeline(cssResolver, html);

      // XML Worker
      XMLWorker worker = new XMLWorker(css, true);
      XMLParser p = new XMLParser(worker);
      Log.i(null, "begin prase: ");
      p.parse(in, Charset.forName("UTF-8"));
      Log.i(null, "after prase: ");
      // step 5
      doc.close();
      in.close();

      Log.i(null, "doc close: ");
      String absolutePath = file.getAbsolutePath();
      Log.i(absolutePath, "absolutePath: ");
      return absolutePath;
    } catch (Exception e) {
      throw new Exception(e);
    }
  }

  private File getTempFile(String fileName) throws Exception {
    try {
      File outputDir = getReactApplicationContext().getCacheDir();
      File outputFile = File.createTempFile("PDF_" + UUID.randomUUID().toString(), ".pdf", outputDir);

      return outputFile;

    } catch (Exception e) {
      throw new Exception(e);
    }
  }

}