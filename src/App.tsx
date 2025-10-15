import "./App.css";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { useState, useEffect } from "react";

function App() {
  const [toggleState, setToggleState] = useState<boolean>(false);

  // Sync with background script on mount
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_MUTE_STATE" }, (response) => {
      if (response?.value !== undefined) {
        setToggleState(response.value);
      }
    });
  }, []);

  const handleToggle = (value: boolean) => {
    setToggleState(value);
    chrome.runtime.sendMessage({ type: "TOGGLE_MUTE", value });
    console.log("Toogled!");
  };

  return (
    <div className="flex cursor-pointer items-center space-x-2">
      <Switch
        id="mute-ads"
        checked={toggleState}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="mute-ads">Mute Sonyliv Ad</Label>
    </div>
  );
}

export default App;
