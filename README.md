# WebGL Physics Shader

An interactive WebGL-based project that combines advanced Blinn-Phong lighting and physics-based simulation. This project showcases dynamic shading, material properties, and real-time interactions such as object transformations, physics-driven animations, and lighting adjustments.

## Demo

https://github.com/user-attachments/assets/17ad563a-3568-4662-86d9-5e046a2c6d34


## Features

- **Blinn-Phong Shading**: Realistic rendering using ambient, diffuse, and specular lighting.
- **Physics Simulation**: Mass-spring system with gravity, damping, and collision handling.
- **Interactive Controls**:
  - Swap Y-Z Axes: Easily transform the model orientation.
  - Auto-Rotation: Dynamic visualization of 3D Meshes.
  - Texture Mapping: Load and apply custom textures
  - Light Direction: 3D widget for changing light direction
  - Real-Time Parameter Adjustment: Adjust parameters (gravity, mass, stiffness, damping, etc.) in real-time.
  - File Loading: Load custom OBJ models and textures.

## Running the Project

1. Clone this repository:
   ```bash
   git clone https://github.com/slbouknight/webgl-physics-shader.git

2. Open the **webgl-physics-shader.html** file in your web browser.
3. Use the controls on the right-hand panel to interact with the scene:
   - Adjust physics and lighting parameters
   - Load a custom OBJ model or texture image.
   - Enable/disable features like auto-rotation and axis swapping

## How It Works
### Blinn-Phong Lighting
This project uses the **Blinn-Phong reflection model** to simulate realistic lighting effects. The lighting equation combines:
  - Ambient: Simulates indirect lighting in the scene.
  - Diffuse: Adds directional light based on the angle between the light source and surface normals.
  - Specular: Adds shiny highlights based on the viewing angle and shininess coefficient.

### Physics Simulation
The project features a mass-spring system implemented with semi-implicit Euler integration. Key components include:
  - **Gravitational Forces:** Simulate downward acceleration
  - **Spring Forces:** Simulate elastic behavior between connected points.
  - **Collision Detection:** Keeps objects inside a bounding box, reversing and damping velocities upon impact.

### Shader Implementation
Custom vertex and fragment shaders handle:
  - Transforming and projecting 3D vertices.
  - Computing normals and lighting in camera space.
  - Applying texture maps for enhanced visual effects.

## Controls
| Control         | Description                                                       |
|------------------|-------------------------------------------------------------------|
| Swap Y-Z Axes    | Switches the Y and Z axes for the model.                         |
| Auto Rotation    | Automatically rotates the model.                                 |
| Time Step Size   | Adjusts the simulation step size in milliseconds.                |
| Gravity          | Sets the gravitational acceleration affecting the simulation.    |
| Mass             | Sets the mass of each particle in the simulation.                |
| Stiffness        | Adjusts the stiffness of the springs in the mass-spring system.  |
| Damping          | Controls velocity damping to simulate energy loss.               |
| Shininess        | Modifies the shininess coefficient of the material in Blinn-Phong shading. |
| OBJ Model        | Uploads a custom 3D model in OBJ format.                         |
| Texture Image    | Uploads a custom texture to apply to the model.                  |

## Acknowledgements
- Cem Yuksel: For providing the project setup and materials as part of his Intro to Computer Graphics course: https://graphics.cs.utah.edu/courses/cs4600/fall2020/
- This project was developed as part of a self-driven learning exercise in WebGL, shader programming, and physics simulation. Graphics code in webgl-physics-shader.js and GLSL implementation of meshVS and meshFS in webgl-physics-shader are my own, initial JavaScript and HTML templates were provided and slightly modified.


