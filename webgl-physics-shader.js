// Computes the Model-View matrix for transforming objects in 3D space.
/**
 * Computes the Model-View matrix based on translation and rotation values.
 * 
 * @param {number} translationX - Translation along the X-axis.
 * @param {number} translationY - Translation along the Y-axis.
 * @param {number} translationZ - Translation along the Z-axis.
 * @param {number} rotationX - Rotation angle around the X-axis (in radians).
 * @param {number} rotationY - Rotation angle around the Y-axis (in radians).
 * @returns {number[]} - A 4x4 Model-View matrix as a flat array.
 */
function GetModelViewMatrix(translationX, translationY, translationZ, rotationX, rotationY) {
    // Translation matrix to shift the object
    var trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    // Rotation matrix for the X-axis
    var cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
    var rotX = [
        1, 0, 0, 0,
        0, cosX, -sinX, 0,
        0, sinX, cosX, 0,
        0, 0, 0, 1
    ];

    // Rotation matrix for the Y-axis
    var cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
    var rotY = [
        cosY, 0, sinY, 0,
        0, 1, 0, 0,
        -sinY, 0, cosY, 0,
        0, 0, 0, 1
    ];

    // Combine transformations: Translation -> Y-axis Rotation -> X-axis Rotation
    return MatrixMult(trans, MatrixMult(rotY, rotX));
}

class MeshDrawer {
    /**
     * Initializes the MeshDrawer for rendering a 3D mesh with textures and lighting.
     * Sets up shaders, buffers, and default parameters.
     */
    constructor() {
        this.prog = InitShaderProgram(meshVS, meshFS); // Initialize vertex and fragment shaders

        // Uniform locations in the shader for transformation matrices, light, and materials
        this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
        this.mvLoc = gl.getUniformLocation(this.prog, 'mv');
        this.normalLoc = gl.getUniformLocation(this.prog, 'normalMatrix');
        this.lightDirLoc = gl.getUniformLocation(this.prog, 'lightDir');
        this.shininessLoc = gl.getUniformLocation(this.prog, 'shininess');
        this.swapYZLoc = gl.getUniformLocation(this.prog, 'swapYZ');
        this.showTextureLoc = gl.getUniformLocation(this.prog, 'showTexture');
        this.texSamplerLoc = gl.getUniformLocation(this.prog, 'texSampler');

        // Attribute locations for vertex position, texture coordinates, and normals
        this.posLoc = gl.getAttribLocation(this.prog, 'pos');
        this.textLoc = gl.getAttribLocation(this.prog, 'tex');
        this.normLoc = gl.getAttribLocation(this.prog, 'normal');

        // Buffers for mesh data
        this.vertexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();

        // Create a default white texture
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Initialize default parameters
        this.numTriangles = 0; // Number of triangles to render
        this.useSwapYZ = false; // Swap Y and Z axes flag
        this.useTexture = true; // Whether to use textures
        this.lightDir = [0.0, 0.0, -1.0]; // Default light direction
        this.shininess = 32.0; // Default shininess for materials
    }

    /**
     * Uploads vertex positions, texture coordinates, and normals to GPU buffers.
     * 
     * @param {number[]} vertPos - Array of vertex positions.
     * @param {number[]} texCoords - Array of texture coordinates.
     * @param {number[]} normals - Array of vertex normals.
     */
    setMesh(vertPos, texCoords, normals) {
        this.numTriangles = vertPos.length / 3;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    }

    /**
     * Toggles swapping of Y and Z axes for the mesh.
     * 
     * @param {boolean} swap - Whether to swap Y and Z axes.
     */
    swapYZ(swap) {
        this.useSwapYZ = swap;
        gl.useProgram(this.prog);
        gl.uniform1i(this.swapYZLoc, this.useSwapYZ);
    }

    /**
     * Renders the mesh using the given transformation matrices.
     * 
     * @param {number[]} matrixMVP - Model-View-Projection matrix.
     * @param {number[]} matrixMV - Model-View matrix.
     * @param {number[]} matrixNormal - Normal matrix.
     */
    draw(matrixMVP, matrixMV, matrixNormal) {
        gl.useProgram(this.prog);

        gl.uniformMatrix4fv(this.mvpLoc, false, matrixMVP);
        gl.uniformMatrix4fv(this.mvLoc, false, matrixMV);
        gl.uniformMatrix3fv(this.normalLoc, false, matrixNormal);
        gl.uniform3fv(this.lightDirLoc, this.lightDir);
        gl.uniform1f(this.shininessLoc, this.shininess);
        gl.uniform1i(this.showTextureLoc, this.useTexture);
        gl.uniform1i(this.swapYZLoc, this.useSwapYZ);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.posLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.textLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.textLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.normLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normLoc);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.texSamplerLoc, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
    }

    /**
     * Sets the texture for the mesh and uploads it to the GPU.
     * 
     * @param {HTMLImageElement} img - The image to use as a texture.
     */
    setTexture(img) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    /**
     * Enables or disables texture rendering.
     * 
     * @param {boolean} show - Whether to show the texture.
     */
    showTexture(show) {
        this.useTexture = show;
    }

    /**
     * Updates the light direction for the shader.
     * 
     * @param {number} x - X component of the light direction.
     * @param {number} y - Y component of the light direction.
     * @param {number} z - Z component of the light direction.
     */
    setLightDir(x, y, z) {
        const length = Math.sqrt(x * x + y * y + z * z);
        this.lightDir = [x / length, y / length, z / length];
        gl.useProgram(this.prog);
        gl.uniform3fv(this.lightDirLoc, this.lightDir);
    }

    /**
     * Updates the shininess factor for the material.
     * 
     * @param {number} shininess - Shininess value (higher = more specular reflection).
     */
    setShininess(shininess) {
        this.shininess = shininess;
        gl.useProgram(this.prog);
        gl.uniform1f(this.shininessLoc, this.shininess);
    }
}

/**
 * Advances the simulation for a given time step using a mass-spring model.
 * Updates the positions and velocities of the particles based on forces, 
 * including gravity, spring forces, damping, and collisions.
 * 
 * @param {number} dt - The time step size in seconds.
 * @param {Vec3[]} positions - Array of particle positions, where each particle is a Vec3 object.
 * @param {Vec3[]} velocities - Array of particle velocities, where each particle is a Vec3 object.
 * @param {Object[]} springs - Array of spring objects, where each object has:
 *      {number} p0 - Index of the first particle connected by the spring.
 *      {number} p1 - Index of the second particle connected by the spring.
 *      {number} rest - Rest length of the spring.
 * @param {number} stiffness - Spring stiffness coefficient (Hooke's Law constant).
 * @param {number} damping - Damping coefficient to reduce oscillations.
 * @param {number} particleMass - Mass of each particle (assumes uniform mass).
 * @param {Vec3} gravity - Gravity vector applied to all particles.
 * @param {number} restitution - Coefficient of restitution for collisions with box walls.
 */
function SimTimeStep(dt, positions, velocities, springs, stiffness, damping, particleMass, gravity, restitution) {
    // Ensure time step is not too large for stability
    if (dt > 0.05) {
        console.warn("Time step too large, consider reducing it.");
        dt = 0.05; // Clamp time step to a maximum value
    }

    // Step 1: Initialize forces for each particle
    const forces = Array(positions.length).fill(null).map(() => new Vec3(0, 0, 0));

    // Step 2: Compute spring forces based on Hooke's Law
    springs.forEach(spring => {
        const p0 = positions[spring.p0]; // Position of the first particle
        const p1 = positions[spring.p1]; // Position of the second particle
        const displacement = p1.sub(p0); // Vector from p0 to p1
        const currentLength = displacement.len(); // Current length of the spring
        const direction = displacement.unit(); // Normalized direction of the spring
        const forceMagnitude = stiffness * (currentLength - spring.rest); // F_spring = k * (L - L_rest)
        const springForce = direction.mul(forceMagnitude); // Spring force vector

        // Apply the spring force to both particles
        forces[spring.p0].inc(springForce);
        forces[spring.p1].dec(springForce);
    });

    // Step 3: Add gravitational forces and apply damping
    for (let i = 0; i < positions.length; i++) {
        forces[i].inc(gravity.mul(particleMass)); // Add gravity: F_gravity = mass * gravity
        forces[i].dec(velocities[i].mul(damping)); // Apply damping proportional to velocity
    }

    // Step 4: Update positions and velocities using semi-implicit Euler integration
    for (let i = 0; i < positions.length; i++) {
        const acceleration = forces[i].div(particleMass); // Acceleration: a = F / m
        velocities[i].inc(acceleration.mul(dt)); // Update velocity: v = v + a * dt
        positions[i].inc(velocities[i].mul(dt)); // Update position: x = x + v * dt
    }

    // Step 5: Handle collisions with the box walls
    const minBound = -1; // Minimum boundary of the box
    const maxBound = 1;  // Maximum boundary of the box

    for (let i = 0; i < positions.length; i++) {
        // Check each axis for collisions
        ['x', 'y', 'z'].forEach(axis => {
            if (positions[i][axis] < minBound) {
                positions[i][axis] = minBound; // Clamp to minimum boundary
                if (velocities[i][axis] < 0) { // If velocity is inward
                    velocities[i][axis] *= -restitution; // Reverse and dampen velocity
                }
            } else if (positions[i][axis] > maxBound) {
                positions[i][axis] = maxBound; // Clamp to maximum boundary
                if (velocities[i][axis] > 0) { // If velocity is outward
                    velocities[i][axis] *= -restitution; // Reverse and dampen velocity
                }
            }
        });
    }
}
