import { useState } from "react";
import Button from "@mui/material/Button";
function App() {
  const [count, setCount] = useState(0);
  return (
    <Button variant="contained" onClick={() => setCount(count + 1)}>
      Hello World! {count}
    </Button>
  );
}

export default App;
