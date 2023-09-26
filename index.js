const A = { coords: { x: 100, y: 200 }, label: "A" };
const B = { coords: { x: 400, y: 300 }, label: "B" };
const MousePointer = { coords: { x: 250, y: 250 }, label: "Mouse" };

const segmentPoints = [A, B];
const allPoints = [A, B, MousePointer];

// Narrow the mouse pointer between A and B vectors
const projectPointToSegment = (vector, A, B) => {
  const AB = subtract(B.coords, A.coords);
  // Debug only
  // drawArrow(add(AB, A.coords), A.coords);

  const AM = subtract(vector.coords, A.coords);
  // Debug only
  // drawArrow(add(AM, A.coords), A.coords);

  const nAB = normalize(AB);

  // Calculate the dot product
  const t = dot(AM, nAB) / distance(A.coords, B.coords);
  // drawText(t);

  const P = lerp2D(A.coords, B.coords, t);
  // drawDot(P, "P");
  return { P, t };
};

const calculateDistanceFromVectorToSegment = (MousePointer, A, B) => {
  const { P, t } = projectPointToSegment(MousePointer, A, B);

  let distanceResult;
  let point = P;

  // Calculate distance from point to segment
  if (t >= 0 && t <= 1) {
    distanceResult = distance(MousePointer.coords, P);
  } else {
    const distToA = distance(MousePointer.coords, A.coords);
    const distToB = distance(MousePointer.coords, B.coords);

    if (distToA < distToB) {
      distanceResult = distToA;
      point = A.coords;
    } else {
      distanceResult = distToB;
      point = B.coords;
    }
  }

  return { distanceResult, point };
};

const redrawAll = () => {
  clearCanvas();
  segmentPoints.forEach((point) => drawDot(point.coords, point.label));
  drawSegment(A.coords, B.coords);
  drawDot(MousePointer.coords, MousePointer.label);
  const result = calculateDistanceFromVectorToSegment(MousePointer, A, B);

  // Draw info
  drawDot(result.point, "P");
  drawText(result.distanceResult.toFixed(2));
  drawArrow(result.point, MousePointer.coords);
};

WORKSPACE.addEventListener("mousemove", (event) => {
  MousePointer.coords.x = event.offsetX;
  MousePointer.coords.y = event.offsetY;
  redrawAll();
});

WORKSPACE.addEventListener("click", (event) => {
  A.coords.x = event.offsetX;
  A.coords.y = event.offsetY;
  redrawAll();
});

WORKSPACE.addEventListener("contextmenu", (event) => {
  B.coords.x = event.offsetX;
  B.coords.y = event.offsetY;
  redrawAll();
  event.preventDefault();
});

redrawAll();
