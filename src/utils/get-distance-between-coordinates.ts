export interface Coordinate {
  latitude: number
  longitude: number
}

// reutrn, in kilometers, the distance between coordinates
export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let distance =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  if (distance > 1) {
    distance = 1
  }

  distance = Math.acos(distance)
  distance = (distance * 180) / Math.PI
  distance = distance * 60 * 1.1515

  // this constant defines the metric system: cm, m, km, miles...
  distance = distance * 1.609344 // kilometers

  return distance
}
