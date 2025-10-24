// ©  M A D E		B Y		SAIF SIDDIQUI  © //

package JFileChooser_Locations_API;
import java.util.prefs.Preferences;


public enum FileLastLocation3 {
  FileLocation;
  private static final Preferences prefs3 = Preferences.userRoot()
                                        .node(FileLastLocation3.class.getName());

  public String get(String defaultValue) {
      return prefs3.get(this.name(), defaultValue);
  }

  public void put(String value) {
      prefs3.put(this.name(), value);
  }
}