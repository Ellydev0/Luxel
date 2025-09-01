<h1>🌟 Luxel - Light debugger for R3F</h1>

A Lighting tool for **[React Three Fiber (R3F)](./)** in debugging lights. It drastically reduces the time in setting up a GUI just to debug the lights in a scene trying to find the right lighting.

---

## 📖 Table of Contents

- [About](#-about)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Contributing](#-contributing)

---

## 🔍 About

Luxel is a light debugger for managing and fine-tuning lights in your **React Three Fiber** scenes.  
Instead of writing code just to set up a GUI and debug lights in the scene, Luxel provides a quick way to create, edit, and test different lighting setups — all stored and never forgotten.

---

## ⚙️ Installation

You can install Luxel via npm:

```bash
npm install --save-dev luxel
```

---

## 🚀 Usage

Import Luxel and start debugging your scene:

```tsx
import { useLuxel } from "luxel";

export default function Scene() {
  const Luxel = useLuxel("presetName");

  return (
    <Luxel gl={/* your WebGLRenderer or props here */}>
      {/*your 3d mesh here*/}
    </Luxel>
  );
}
```

---

## ✨ Features

- 🔥 **Presets** – easily switch between defined lighting setups.
- 🔥 **LocalStorage sync** – your lights persist across refreshes.
- 🔥 **Light Helpers** – visualize how your lights are positioned in the scene.
- 🔥 **Export to React** – export your lights as a clean React component.
- 🔥 **Neat Tweakpane GUI** – tweak without writing extra UI code.

---

## 📚 API Reference

| Function          | Signature                                                     | Description                                                                                                                                                |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useLuxel`        | `useLuxel(preset: string,helperScale = 1) => FC<CanvasProps>` | Main hook that renders the GUI for debugging your lights. Accepts a preset name and returns a React Three Fiber Canvas component to wrap your 3d elements. |
| `useRegisterMesh` | `useRegisterMesh(name: string, ref: THREE.Object3D)`          | Registers a mesh ref into Luxel's Zustand state. Lets you target meshes by name inside directional or spotlight configurations.                            |

---

## 🎮 Demo

[Luxel-Demo](./)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- Fork the repo
- Create your feature branch (`git checkout -b feature/amazing-feature`)
- Commit your changes (`git commit -m 'Add some amazing feature'`)
- Push to the branch (`git push origin feature/amazing-feature`)
- Open a Pull Request 🚀

If you have ideas for new features (or spot bugs), please open an issue.

---

## 📚 Learn More

- [React Three Fiber (R3F)](./)
- [Tweakpane](./)

---

<p align="center">
 Built with ❤️‍🔥 by <b>Elliot Otoijagha</b>
 <br />
 <a href="https://x.com/Elly_dev0">X(Twitter)</a> |
 <a href="https://www.threads.com/@elly_dev0">Threads</a> |
 <a href="https://www.instagram.com/elly_dev0">Instagram</a> |
 <a href="https://www.tiktok.com/@elly_dev0">Tiktok</a>
</p>
