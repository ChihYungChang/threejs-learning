function noise(x, y) {
  var n = x + y * 57;
  n = (n << 13) ^ n;
  return (
    1.0 -
    ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0
  );
}

function smoothNoise(x, y) {
  var corners =
    (noise(x - 1, y - 1) +
      noise(x + 1, y - 1) +
      noise(x - 1, y + 1) +
      noise(x + 1, y + 1)) /
    16;
  var sides =
    (noise(x - 1, y) + noise(x + 1, y) + noise(x, y - 1) + noise(x, y + 1)) / 8;
  var center = noise(x, y) / 4;
  return corners + sides + center;
}

function interpolatedNoise(x, y) {
  var integer_X = Math.floor(x);
  var fractional_X = x - integer_X;

  var integer_Y = Math.floor(y);
  var fractional_Y = y - integer_Y;

  var v1 = smoothNoise(integer_X, integer_Y);
  var v2 = smoothNoise(integer_X + 1, integer_Y);
  var v3 = smoothNoise(integer_X, integer_Y + 1);
  var v4 = smoothNoise(integer_X + 1, integer_Y + 1);

  var i1 = interpolate(v1, v2, fractional_X);
  var i2 = interpolate(v3, v4, fractional_X);

  return interpolate(i1, i2, fractional_Y);
}

function interpolate(a, b, x) {
  var ft = x * Math.PI;
  var f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
}

function random(min, max) {
  if (max != undefined) {
    return Math.random() * (max - min) + min;
  } else {
    return Math.random() * min;
  }
}

export { random, noise, smoothNoise, interpolatedNoise };
