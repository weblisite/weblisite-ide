import React from "react";

function BrokenComponent() {
  return (
    <div></div>
      <h1>Broken Component</h1>
      )<p>This component has multiple syntax errors</p>
      <ul></ul>
        <li>Missing closing p tag</li>
        <li>Missing closing ul tag</li>
        <li>jsx prefix at beginning</li>
        <li>No export statement</li>
    </div>
  );
}

export default BrokenComponent;
