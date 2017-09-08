

package com.christopherdro.htmltopdf;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.itextpdf.text.BadElementException;
import com.itextpdf.text.Image;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
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
import com.itextpdf.tool.xml.pipeline.html.AbstractImageProvider;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;

import android.os.Environment;
import android.util.Log;

public class RNHTMLtoPDFModule extends ReactContextBaseJavaModule {

  class Base64ImageProvider extends AbstractImageProvider {

    @Override
    public Image retrieve(String src) {
      int pos = src.indexOf("base64,");
      try {
        if (src.startsWith("data") && pos > 0) {
          byte[] img = Base64.decode(src.substring(pos + 7));
          return Image.getInstance(img);
        }
        else {
          return Image.getInstance(src);
        }
      } catch (BadElementException ex) {
        return null;
      } catch (IOException ex) {
        return null;
      }
    }

    @Override
    public String getImageRootPath() {
      return null;
    }
  }

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
      Log.i(htmlString, "htmlString: ");

      String css = options.hasKey("css") ? options.getString("css") : null;
      Log.i(null, "css = " + css);

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

      String filePath = convertToPDF(htmlString, css, destinationFile);

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

  private String convertToPDF(String htmlString, String cssString, File file) throws Exception {
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
      CSSResolver cssResolver =
              XMLWorkerHelper.getInstance().getDefaultCssResolver(true);

      CssFile cssFile = XMLWorkerHelper.getCSS(new ByteArrayInputStream(cssString.getBytes()));
      cssResolver.addCss(cssFile);

      Log.i(null, "css define: ");

      CssAppliers cssAppliers = new CssAppliersImpl(fontProvider);
      HtmlPipelineContext htmlContext = new HtmlPipelineContext(cssAppliers);
      htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
      htmlContext.setImageProvider(new Base64ImageProvider());

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