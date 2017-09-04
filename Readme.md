public String convertToUnicode(String s) {
        int i = 0, len = s.length();
        char c;
        StringBuffer sb = new StringBuffer(len);
        try {
            while (i < len) {
                c = s.charAt(i++);
                if (c == '\\') {
                    if (i < len) {
                        c = s.charAt(i++);
                        if (c == 'u') {
                            if (Character.digit(s.charAt(i), 16) != -1
                                    && Character.digit(s.charAt(i + 1), 16) != -1
                                    && Character.digit(s.charAt(i + 2), 16) != -1
                                    && Character.digit(s.charAt(i + 3), 16) != -1) {
                                if (s.substring(i).length() >= 4) {
                                    c = (char) Integer.parseInt(s.substring(i, i + 4), 16);
                                    i += 4;
                                } else {
                                    sb.append('\\');
                                }
                            } else {
                                sb.append('\\');
                            }
                        } // add other cases here as desired...
                    }
                } // fall through: \ escapes itself, quotes any character but u
                sb.append(c);
            }
        } catch (Exception e) {
            System.out.println("Error Generate PDF :: " + e.getStackTrace().toString());
            return s;
        }
        return sb.toString();
    }


    https://stackoverflow.com/questions/22085316/how-to-export-vietnamese-text-to-pdf-using-itext
    http://developers.itextpdf.com/question/how-export-vietnamese-text-pdf-using-itext
    http://developers.itextpdf.com/examples/xml-worker-itext5/xml-worker-examples#714-d07tris_parsehtmlasian.java