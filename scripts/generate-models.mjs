/**
 * Generates T-shirt and Hoodie GLB models with realistic garment silhouettes.
 * Uses @gltf-transform/core for Node.js-compatible GLB creation.
 *
 * The torso is shaped as a flattened body form (wide, shallow depth)
 * with natural garment curves: shoulder taper, slight waist, hem flare.
 */
import { Document, NodeIO } from "@gltf-transform/core";

// ─── T-Shirt ────────────────────────────────────────────────

function createTshirtDocument() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("TshirtScene");

  const body = createGarmentBody(doc, buffer, {
    name: "Body",
    // Cross-section profile from bottom (hem) to top (shoulders)
    // Each row: [y, halfWidth, halfDepth]
    profile: [
      [-0.26, 0.19, 0.10],  // hem - slightly wider
      [-0.20, 0.185, 0.095],
      [-0.12, 0.175, 0.09],  // waist - slight taper
      [-0.04, 0.175, 0.09],
      [0.04,  0.18,  0.09],  // chest
      [0.12,  0.185, 0.09],  // upper chest
      [0.18,  0.20,  0.085], // shoulder area widens
      [0.24,  0.21,  0.08],  // shoulders
      [0.26,  0.18,  0.07],  // top shoulder slope
    ],
    ringSegments: 32,
    flattenFactor: 0.6, // how flat the front/back are (0=round, 1=flat)
  });

  const leftSleeve = createShortSleeve(doc, buffer, {
    name: "LeftSleeve",
    shoulderX: -0.21,
    shoulderY: 0.20,
    length: 0.15,
    radiusTop: 0.065,
    radiusBottom: 0.07,
    angle: 0.55, // angle down from horizontal
    flattenFactor: 0.3,
  });

  const rightSleeve = createShortSleeve(doc, buffer, {
    name: "RightSleeve",
    shoulderX: 0.21,
    shoulderY: 0.20,
    length: 0.15,
    radiusTop: 0.065,
    radiusBottom: 0.07,
    angle: 0.55,
    flattenFactor: 0.3,
  });

  const collar = createCrewNeck(doc, buffer, {
    name: "Collar",
    radiusX: 0.065,
    radiusZ: 0.045,
    thickness: 0.014,
    height: 0.02,
    offsetY: 0.265,
    segments: 32,
  });

  const mat = doc.createMaterial("GarmentMaterial")
    .setBaseColorFactor([0.53, 0.53, 0.53, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.85)
    .setDoubleSided(true);

  [body, leftSleeve, rightSleeve, collar].forEach(mesh =>
    mesh.listPrimitives().forEach(p => p.setMaterial(mat))
  );

  const rootNode = doc.createNode("Body").setMesh(body);
  rootNode.addChild(doc.createNode("LeftSleeve").setMesh(leftSleeve));
  rootNode.addChild(doc.createNode("RightSleeve").setMesh(rightSleeve));
  rootNode.addChild(doc.createNode("Collar").setMesh(collar));

  scene.addChild(rootNode);
  return doc;
}

// ─── Hoodie ─────────────────────────────────────────────────

function createHoodieDocument() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("HoodieScene");

  const body = createGarmentBody(doc, buffer, {
    name: "Body",
    profile: [
      [-0.28, 0.21, 0.12],   // hem
      [-0.22, 0.205, 0.115],
      [-0.14, 0.195, 0.11],  // waist
      [-0.06, 0.195, 0.11],
      [0.02,  0.20,  0.11],  // chest
      [0.10,  0.205, 0.11],  // upper chest
      [0.16,  0.215, 0.105], // shoulder area
      [0.22,  0.225, 0.10],  // shoulders - hoodie is boxier
      [0.26,  0.20,  0.09],  // top shoulder
    ],
    ringSegments: 32,
    flattenFactor: 0.55,
  });

  const leftSleeve = createLongSleeve(doc, buffer, {
    name: "LeftSleeve",
    shoulderX: -0.225,
    shoulderY: 0.19,
    length: 0.28,
    radiusTop: 0.07,
    radiusBottom: 0.055,
    angle: 0.50,
    flattenFactor: 0.25,
  });

  const rightSleeve = createLongSleeve(doc, buffer, {
    name: "RightSleeve",
    shoulderX: 0.225,
    shoulderY: 0.19,
    length: 0.28,
    radiusTop: 0.07,
    radiusBottom: 0.055,
    angle: 0.50,
    flattenFactor: 0.25,
  });

  const hood = createHoodShape(doc, buffer, {
    name: "Hood",
    width: 0.19,
    height: 0.18,
    depth: 0.16,
    offsetY: 0.27,
    offsetZ: -0.05,
    segments: 14,
  });

  const pocket = createKangarooPocket(doc, buffer, {
    name: "Pocket",
    width: 0.22,
    height: 0.09,
    depth: 0.006,
    offsetY: -0.08,
    offsetZ: 0.12,
    cornerRadius: 0.02,
  });

  const mat = doc.createMaterial("GarmentMaterial")
    .setBaseColorFactor([0.53, 0.53, 0.53, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.9)
    .setDoubleSided(true);

  [body, leftSleeve, rightSleeve, hood, pocket].forEach(mesh =>
    mesh.listPrimitives().forEach(p => p.setMaterial(mat))
  );

  const rootNode = doc.createNode("Body").setMesh(body);
  rootNode.addChild(doc.createNode("LeftSleeve").setMesh(leftSleeve));
  rootNode.addChild(doc.createNode("RightSleeve").setMesh(rightSleeve));
  rootNode.addChild(doc.createNode("Hood").setMesh(hood));
  rootNode.addChild(doc.createNode("Pocket").setMesh(pocket));

  scene.addChild(rootNode);
  return doc;
}

// ─── Long Sleeve ────────────────────────────────────────────

function createLongSleeveDocument() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("LongSleeveScene");

  const body = createGarmentBody(doc, buffer, {
    name: "LongSleeve_Body",
    profile: [
      [-0.28, 0.19, 0.10],  // hem - slightly longer than tshirt
      [-0.22, 0.185, 0.095],
      [-0.14, 0.175, 0.09],  // waist
      [-0.06, 0.175, 0.09],
      [0.04,  0.18,  0.09],  // chest
      [0.12,  0.185, 0.09],  // upper chest
      [0.18,  0.20,  0.085], // shoulder area
      [0.24,  0.21,  0.08],  // shoulders
      [0.26,  0.18,  0.07],  // top shoulder slope
    ],
    ringSegments: 32,
    flattenFactor: 0.6,
  });

  const leftSleeve = createSleeve(doc, buffer, {
    name: "LeftSleeve",
    shoulderX: -0.21,
    shoulderY: 0.20,
    length: 0.28,
    radiusTop: 0.065,
    radiusBottom: 0.05,
    angle: 0.55,
    flattenFactor: 0.25,
  }, 10);

  const rightSleeve = createSleeve(doc, buffer, {
    name: "RightSleeve",
    shoulderX: 0.21,
    shoulderY: 0.20,
    length: 0.28,
    radiusTop: 0.065,
    radiusBottom: 0.05,
    angle: 0.55,
    flattenFactor: 0.25,
  }, 10);

  const collar = createCrewNeck(doc, buffer, {
    name: "Collar",
    radiusX: 0.065,
    radiusZ: 0.045,
    thickness: 0.014,
    height: 0.02,
    offsetY: 0.265,
    segments: 32,
  });

  const mat = doc.createMaterial("GarmentMaterial")
    .setBaseColorFactor([0.53, 0.53, 0.53, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.85)
    .setDoubleSided(true);

  [body, leftSleeve, rightSleeve, collar].forEach(mesh =>
    mesh.listPrimitives().forEach(p => p.setMaterial(mat))
  );

  const rootNode = doc.createNode("LongSleeve_Body").setMesh(body);
  rootNode.addChild(doc.createNode("LeftSleeve").setMesh(leftSleeve));
  rootNode.addChild(doc.createNode("RightSleeve").setMesh(rightSleeve));
  rootNode.addChild(doc.createNode("Collar").setMesh(collar));

  scene.addChild(rootNode);
  return doc;
}

// ─── Tank Top ────────────────────────────────────────────────

function createTankTopDocument() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("TankTopScene");

  const body = createGarmentBody(doc, buffer, {
    name: "TankTop_Body",
    // Narrower shoulders, deeper armholes, wider neck
    profile: [
      [-0.26, 0.18, 0.10],  // hem
      [-0.20, 0.175, 0.095],
      [-0.12, 0.165, 0.09],  // waist - slightly narrower
      [-0.04, 0.165, 0.09],
      [0.04,  0.17,  0.09],  // chest
      [0.12,  0.17,  0.088], // upper chest
      [0.18,  0.165, 0.082], // shoulder area - narrower (deep armhole)
      [0.22,  0.155, 0.075], // shoulders - narrow for tank
      [0.24,  0.13,  0.065], // top shoulder slope - narrow
    ],
    ringSegments: 32,
    flattenFactor: 0.6,
  });

  // Wider neck opening for tank top
  const collar = createCrewNeck(doc, buffer, {
    name: "Collar",
    radiusX: 0.085,  // wider than tshirt
    radiusZ: 0.06,
    thickness: 0.012,
    height: 0.015,
    offsetY: 0.245,  // lower because narrower shoulders
    segments: 32,
  });

  const mat = doc.createMaterial("GarmentMaterial")
    .setBaseColorFactor([0.53, 0.53, 0.53, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.85)
    .setDoubleSided(true);

  [body, collar].forEach(mesh =>
    mesh.listPrimitives().forEach(p => p.setMaterial(mat))
  );

  const rootNode = doc.createNode("TankTop_Body").setMesh(body);
  rootNode.addChild(doc.createNode("Collar").setMesh(collar));

  scene.addChild(rootNode);
  return doc;
}

// ─── Polo ────────────────────────────────────────────────────

function createPoloDocument() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("PoloScene");

  const body = createGarmentBody(doc, buffer, {
    name: "Polo_Body",
    profile: [
      [-0.26, 0.19, 0.10],  // hem
      [-0.20, 0.185, 0.095],
      [-0.12, 0.175, 0.09],  // waist
      [-0.04, 0.175, 0.09],
      [0.04,  0.18,  0.09],  // chest
      [0.12,  0.185, 0.09],  // upper chest
      [0.18,  0.20,  0.085], // shoulder area
      [0.24,  0.21,  0.08],  // shoulders
      [0.26,  0.18,  0.07],  // top shoulder slope
    ],
    ringSegments: 32,
    flattenFactor: 0.6,
  });

  const leftSleeve = createShortSleeve(doc, buffer, {
    name: "LeftSleeve",
    shoulderX: -0.21,
    shoulderY: 0.20,
    length: 0.15,
    radiusTop: 0.065,
    radiusBottom: 0.07,
    angle: 0.55,
    flattenFactor: 0.3,
  });

  const rightSleeve = createShortSleeve(doc, buffer, {
    name: "RightSleeve",
    shoulderX: 0.21,
    shoulderY: 0.20,
    length: 0.15,
    radiusTop: 0.065,
    radiusBottom: 0.07,
    angle: 0.55,
    flattenFactor: 0.3,
  });

  const collar = createPoloCollar(doc, buffer, {
    name: "Collar",
    radiusX: 0.06,
    radiusZ: 0.042,
    thickness: 0.016,
    height: 0.035,  // taller than crew neck
    offsetY: 0.265,
    segments: 32,
    placketWidth: 0.022,
    placketDepth: 0.055,
  });

  const mat = doc.createMaterial("GarmentMaterial")
    .setBaseColorFactor([0.53, 0.53, 0.53, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.85)
    .setDoubleSided(true);

  [body, leftSleeve, rightSleeve, collar].forEach(mesh =>
    mesh.listPrimitives().forEach(p => p.setMaterial(mat))
  );

  const rootNode = doc.createNode("Polo_Body").setMesh(body);
  rootNode.addChild(doc.createNode("LeftSleeve").setMesh(leftSleeve));
  rootNode.addChild(doc.createNode("RightSleeve").setMesh(rightSleeve));
  rootNode.addChild(doc.createNode("Collar").setMesh(collar));

  scene.addChild(rootNode);
  return doc;
}

// ─── Garment Body ───────────────────────────────────────────

/**
 * Creates a garment body from a vertical profile of cross-sections.
 * Each cross-section is a flattened oval - wider than deep, with
 * flat front/back panels to mimic how fabric drapes on a body form.
 */
function createGarmentBody(doc, buffer, opts) {
  const { name, profile, ringSegments, flattenFactor } = opts;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  const rows = profile.length;

  for (let row = 0; row < rows; row++) {
    const [y, halfW, halfD] = profile[row];
    const v = row / (rows - 1);

    for (let col = 0; col <= ringSegments; col++) {
      const u = col / ringSegments;
      const angle = u * Math.PI * 2;

      // Base ellipse
      let x = Math.cos(angle) * halfW;
      let z = Math.sin(angle) * halfD;

      // Flatten front and back panels
      // When |cos(angle)| is small (sides), keep round
      // When |cos(angle)| is large (front/back), flatten z
      const cosAbs = Math.abs(Math.cos(angle));
      const flatBlend = Math.pow(1 - cosAbs, 2); // 1 at sides, 0 at front/back
      const depthScale = 1 - flattenFactor * (1 - flatBlend);
      z *= depthScale;

      positions.push(x, y, z);

      // Compute normal (approximate outward)
      const nx = Math.cos(angle) / halfW;
      const nz = Math.sin(angle) / (halfD * depthScale);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);

      uvs.push(u, v);
    }
  }

  // Quads
  const ringVerts = ringSegments + 1;
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < ringSegments; col++) {
      const a = row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  // Bottom cap (hem)
  addFlatCap(positions, normals, uvs, indices, profile[0], ringSegments, -1, flattenFactor);
  // Top cap (shoulders) - usually hidden by collar/sleeves
  addFlatCap(positions, normals, uvs, indices, profile[rows - 1], ringSegments, 1, flattenFactor);

  return buildMesh(doc, buffer, name, positions, normals, uvs, indices);
}

function addFlatCap(positions, normals, uvs, indices, profileRow, ringSegments, ny, flattenFactor) {
  const [y, halfW, halfD] = profileRow;
  const baseIdx = positions.length / 3;

  // Center
  positions.push(0, y, 0);
  normals.push(0, ny, 0);
  uvs.push(0.5, 0.5);

  for (let i = 0; i <= ringSegments; i++) {
    const angle = (i / ringSegments) * Math.PI * 2;
    let x = Math.cos(angle) * halfW;
    let z = Math.sin(angle) * halfD;

    const cosAbs = Math.abs(Math.cos(angle));
    const flatBlend = Math.pow(1 - cosAbs, 2);
    z *= 1 - flattenFactor * (1 - flatBlend);

    positions.push(x, y, z);
    normals.push(0, ny, 0);
    uvs.push(0.5 + Math.cos(angle) * 0.5, 0.5 + Math.sin(angle) * 0.5);
  }

  for (let i = 0; i < ringSegments; i++) {
    if (ny > 0) {
      indices.push(baseIdx, baseIdx + 1 + i, baseIdx + 2 + i);
    } else {
      indices.push(baseIdx, baseIdx + 2 + i, baseIdx + 1 + i);
    }
  }
}

// ─── Sleeves ────────────────────────────────────────────────

function createSleeve(doc, buffer, opts, segments) {
  const { name, shoulderX, shoulderY, length, radiusTop, radiusBottom, angle, flattenFactor } = opts;
  const ringSegs = 16;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  const dir = Math.sign(shoulderX); // -1 for left, +1 for right
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  for (let row = 0; row <= segments; row++) {
    const t = row / segments;
    const radius = radiusTop + (radiusBottom - radiusTop) * t;

    // Position along sleeve axis
    const axisLen = t * length;
    const cx = shoulderX + dir * axisLen * cosA;
    const cy = shoulderY - axisLen * sinA;

    for (let col = 0; col <= ringSegs; col++) {
      const u = col / ringSegs;
      const ringAngle = u * Math.PI * 2;

      // Cross-section of sleeve (slightly flattened oval)
      let rx = Math.cos(ringAngle) * radius;
      let ry = Math.sin(ringAngle) * radius;

      // Flatten slightly
      const flatBlend = Math.pow(Math.abs(Math.sin(ringAngle)), 2);
      ry *= 1 - flattenFactor * (1 - flatBlend);

      // Rotate cross-section to align with sleeve direction
      // Sleeve goes outward and down, so rotate the cross-section
      const px = cx + rx * sinA * dir;
      const py = cy + rx * cosA;
      const pz = ry;

      positions.push(px, py, pz);

      // Normal
      const nx = Math.cos(ringAngle) * sinA * dir;
      const ny = Math.cos(ringAngle) * cosA;
      const nz = Math.sin(ringAngle);
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normals.push(nx / len, ny / len, nz / len);

      uvs.push(u, t);
    }
  }

  const ringVerts = ringSegs + 1;
  for (let row = 0; row < segments; row++) {
    for (let col = 0; col < ringSegs; col++) {
      const a = row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  return buildMesh(doc, buffer, name, positions, normals, uvs, indices);
}

function createShortSleeve(doc, buffer, opts) {
  return createSleeve(doc, buffer, opts, 6);
}

function createLongSleeve(doc, buffer, opts) {
  return createSleeve(doc, buffer, opts, 10);
}

// ─── Collar ─────────────────────────────────────────────────

function createCrewNeck(doc, buffer, opts) {
  const { name, radiusX, radiusZ, thickness, height, offsetY, segments } = opts;
  const heightSegs = 3;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Create a collar as a band around the neckline
  for (let row = 0; row <= heightSegs; row++) {
    const t = row / heightSegs;
    const y = offsetY + t * height;
    const r = 1 + t * 0.05; // slight outward flare

    for (let col = 0; col <= segments; col++) {
      const u = col / segments;
      const angle = u * Math.PI * 2;

      // Outer ring
      const x = Math.cos(angle) * radiusX * r;
      const z = Math.sin(angle) * radiusZ * r;

      positions.push(x, y, z);

      const nx = Math.cos(angle);
      const nz = Math.sin(angle);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);
      uvs.push(u, t);
    }
  }

  // Inner ring (creates thickness)
  for (let row = 0; row <= heightSegs; row++) {
    const t = row / heightSegs;
    const y = offsetY + t * height;

    for (let col = 0; col <= segments; col++) {
      const u = col / segments;
      const angle = u * Math.PI * 2;

      const x = Math.cos(angle) * (radiusX - thickness);
      const z = Math.sin(angle) * (radiusZ - thickness);

      positions.push(x, y, z);

      const nx = -Math.cos(angle);
      const nz = -Math.sin(angle);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);
      uvs.push(u, t);
    }
  }

  const ringVerts = segments + 1;

  // Outer surface
  for (let row = 0; row < heightSegs; row++) {
    for (let col = 0; col < segments; col++) {
      const a = row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  // Inner surface (reversed winding)
  const innerOffset = (heightSegs + 1) * ringVerts;
  for (let row = 0; row < heightSegs; row++) {
    for (let col = 0; col < segments; col++) {
      const a = innerOffset + row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  return buildMesh(doc, buffer, name, positions, normals, uvs, indices);
}

// ─── Polo Collar ─────────────────────────────────────────────

/**
 * Taller collar with a front placket detail (rectangular flap at center front).
 */
function createPoloCollar(doc, buffer, opts) {
  const { name, radiusX, radiusZ, thickness, height, offsetY, segments, placketWidth, placketDepth } = opts;
  const heightSegs = 4; // more segments for taller collar
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Outer ring
  for (let row = 0; row <= heightSegs; row++) {
    const t = row / heightSegs;
    const y = offsetY + t * height;
    const r = 1 + t * 0.04; // slight outward flare

    for (let col = 0; col <= segments; col++) {
      const u = col / segments;
      const angle = u * Math.PI * 2;

      const x = Math.cos(angle) * radiusX * r;
      const z = Math.sin(angle) * radiusZ * r;

      positions.push(x, y, z);

      const nx = Math.cos(angle);
      const nz = Math.sin(angle);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);
      uvs.push(u, t);
    }
  }

  // Inner ring (creates thickness)
  for (let row = 0; row <= heightSegs; row++) {
    const t = row / heightSegs;
    const y = offsetY + t * height;

    for (let col = 0; col <= segments; col++) {
      const u = col / segments;
      const angle = u * Math.PI * 2;

      const x = Math.cos(angle) * (radiusX - thickness);
      const z = Math.sin(angle) * (radiusZ - thickness);

      positions.push(x, y, z);

      const nx = -Math.cos(angle);
      const nz = -Math.sin(angle);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);
      uvs.push(u, t);
    }
  }

  const ringVerts = segments + 1;

  // Outer surface
  for (let row = 0; row < heightSegs; row++) {
    for (let col = 0; col < segments; col++) {
      const a = row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  // Inner surface (reversed winding)
  const innerOffset = (heightSegs + 1) * ringVerts;
  for (let row = 0; row < heightSegs; row++) {
    for (let col = 0; col < segments; col++) {
      const a = innerOffset + row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  // Front placket - a flat rectangular flap at center-front (z positive)
  const placketBaseIdx = positions.length / 3;
  const halfPW = placketWidth / 2;
  const pTop = offsetY + height;
  const pBot = offsetY - placketDepth;
  const pZ = radiusZ + 0.002; // just in front of collar

  // 4 corners of placket: bottom-left, bottom-right, top-right, top-left
  const placketVerts = [
    [-halfPW, pBot, pZ],
    [ halfPW, pBot, pZ],
    [ halfPW, pTop, pZ],
    [-halfPW, pTop, pZ],
  ];
  for (const [px, py, pz] of placketVerts) {
    positions.push(px, py, pz);
    normals.push(0, 0, 1);
    uvs.push(0.5 + px / placketWidth, (py - pBot) / (pTop - pBot));
  }
  // Two triangles for the placket face
  indices.push(
    placketBaseIdx, placketBaseIdx + 1, placketBaseIdx + 2,
    placketBaseIdx, placketBaseIdx + 2, placketBaseIdx + 3
  );

  return buildMesh(doc, buffer, name, positions, normals, uvs, indices);
}

// ─── Hood ───────────────────────────────────────────────────

function createHoodShape(doc, buffer, opts) {
  const { name, width, height, depth, offsetY, offsetZ, segments } = opts;
  const halfW = width / 2;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Hood as a curved shell going from neck upward and backward
  for (let row = 0; row <= segments; row++) {
    const t = row / segments;
    const phi = t * Math.PI * 0.6;

    const y = offsetY + Math.cos(phi) * height;
    const zBase = offsetZ - Math.sin(phi) * depth;
    const rowWidth = halfW * (0.6 + 0.4 * Math.sin(phi + 0.2));

    for (let col = 0; col <= segments; col++) {
      const s = col / segments;
      const x = -rowWidth + s * rowWidth * 2;

      // Add some roundness to the back of the hood
      const bulge = Math.sin(s * Math.PI) * 0.025 * Math.sin(phi);

      positions.push(x, y, zBase - bulge);

      const nx = (s - 0.5) * 0.3;
      const ny = Math.cos(phi) * 0.5;
      const nz = -Math.sin(phi);
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normals.push(nx / len, ny / len, nz / len);
      uvs.push(s, t);
    }
  }

  const ringVerts = segments + 1;
  for (let row = 0; row < segments; row++) {
    for (let col = 0; col < segments; col++) {
      const a = row * ringVerts + col;
      const b = a + 1;
      const c = a + ringVerts;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  return buildMesh(doc, buffer, name, positions, normals, uvs, indices);
}

// ─── Pocket ─────────────────────────────────────────────────

function createKangarooPocket(doc, buffer, opts) {
  const { name, width, height, depth, offsetY, offsetZ, cornerRadius } = opts;
  const halfW = width / 2;
  const halfH = height / 2;
  const segs = 4; // segments per corner

  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Create rounded rectangle patch
  const outline = [];

  // Bottom-left corner
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI + (Math.PI / 2) * (i / segs);
    outline.push([
      -halfW + cornerRadius + Math.cos(a) * cornerRadius,
      -halfH + cornerRadius + Math.sin(a) * cornerRadius,
    ]);
  }
  // Bottom-right corner
  for (let i = 0; i <= segs; i++) {
    const a = (3 * Math.PI / 2) + (Math.PI / 2) * (i / segs);
    outline.push([
      halfW - cornerRadius + Math.cos(a) * cornerRadius,
      -halfH + cornerRadius + Math.sin(a) * cornerRadius,
    ]);
  }
  // Top-right corner
  for (let i = 0; i <= segs; i++) {
    const a = 0 + (Math.PI / 2) * (i / segs);
    outline.push([
      halfW - cornerRadius + Math.cos(a) * cornerRadius,
      halfH - cornerRadius + Math.sin(a) * cornerRadius,
    ]);
  }
  // Top-left corner
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI / 2 + (Math.PI / 2) * (i / segs);
    outline.push([
      -halfW + cornerRadius + Math.cos(a) * cornerRadius,
      halfH - cornerRadius + Math.sin(a) * cornerRadius,
    ]);
  }

  // Center vertex
  const baseIdx = 0;
  positions.push(0, offsetY, offsetZ + depth);
  normals.push(0, 0, 1);
  uvs.push(0.5, 0.5);

  // Outline vertices
  for (const [ox, oy] of outline) {
    positions.push(ox, offsetY + oy, offsetZ + depth * (1 - Math.abs(oy / halfH) * 0.3));
    normals.push(0, 0, 1);
    uvs.push(0.5 + ox / width, 0.5 + oy / height);
  }

  // Fan triangles
  const n = outline.length;
  for (let i = 0; i < n; i++) {
    indices.push(baseIdx, baseIdx + 1 + i, baseIdx + 1 + ((i + 1) % n));
  }

  return buildMesh(doc, buffer, name, positions, normals, uvs, indices);
}

// ─── GLB Builder ────────────────────────────────────────────

function buildMesh(doc, buffer, name, posArr, normArr, uvArr, idxArr) {
  const posData = new Float32Array(posArr);
  const normData = new Float32Array(normArr);
  const uvData = new Float32Array(uvArr);
  const idxData = new Uint16Array(idxArr);

  const posAccessor = doc.createAccessor()
    .setType("VEC3").setArray(posData).setBuffer(buffer);
  const normAccessor = doc.createAccessor()
    .setType("VEC3").setArray(normData).setBuffer(buffer);
  const uvAccessor = doc.createAccessor()
    .setType("VEC2").setArray(uvData).setBuffer(buffer);
  const idxAccessor = doc.createAccessor()
    .setType("SCALAR").setArray(idxData).setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setAttribute("POSITION", posAccessor)
    .setAttribute("NORMAL", normAccessor)
    .setAttribute("TEXCOORD_0", uvAccessor)
    .setIndices(idxAccessor);

  return doc.createMesh(name).addPrimitive(prim);
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const io = new NodeIO();

  console.log("Generating T-shirt model...");
  const tshirtDoc = createTshirtDocument();
  await io.write("public/models/tshirt.glb", tshirtDoc);
  console.log("Written: public/models/tshirt.glb");

  console.log("Generating Hoodie model...");
  const hoodieDoc = createHoodieDocument();
  await io.write("public/models/hoodie.glb", hoodieDoc);
  console.log("Written: public/models/hoodie.glb");

  console.log("Generating Long Sleeve model...");
  const longSleeveDoc = createLongSleeveDocument();
  await io.write("public/models/longsleeve.glb", longSleeveDoc);
  console.log("Written: public/models/longsleeve.glb");

  console.log("Generating Tank Top model...");
  const tankTopDoc = createTankTopDocument();
  await io.write("public/models/tanktop.glb", tankTopDoc);
  console.log("Written: public/models/tanktop.glb");

  console.log("Generating Polo model...");
  const poloDoc = createPoloDocument();
  await io.write("public/models/polo.glb", poloDoc);
  console.log("Written: public/models/polo.glb");

  console.log("Done!");
}

main().catch(console.error);
