// ©  M A D E		B Y		SAIF SIDDIQUI  © //

package Panels_EmployeeManager;
import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.PlainDocument;


public class JTextFieldLimitAPI extends PlainDocument {
   final public int limit;
   JTextFieldLimitAPI(int limit) {
      super();
      this.limit = limit;
   }
   JTextFieldLimitAPI(int limit, boolean upper) {
      super();
      this.limit = limit;
   }
   @Override
   public void insertString(int offset, String str, AttributeSet attr) throws BadLocationException {
       if (str == null)
         return;
      if ((getLength() + str.length()) <= limit) {
         super.insertString(offset, str, attr);
      }
   }
}