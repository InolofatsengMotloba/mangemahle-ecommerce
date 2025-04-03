// import React from "react";

// const IndoorMap = ({
//   userLocation,
//   productLocation,
//   width = 300,
//   height = 300,
// }) => {
//   // Default to center if locations aren't available
//   const defaultCenter = { x: width / 2, y: height / 2 };

//   // Generate map coordinates based on latitude and longitude
//   const getMapCoordinates = (location, referenceLocation) => {
//     if (!location) return null;
//     if (!referenceLocation) return defaultCenter;

//     // Simple conversion from lat/long to x/y coordinates
//     // For indoor maps, this is a simplified approach that works for small areas
//     const latDiff = location.latitude - referenceLocation.latitude;
//     const lngDiff = location.longitude - referenceLocation.longitude;

//     // Scale factor (adjust as needed for your indoor space)
//     const scale = 100000;

//     return {
//       x: width / 2 + lngDiff * scale,
//       y: height / 2 - latDiff * scale, // Negative because y increases downward in SVG
//     };
//   };

//   // For simple visualization, use product location as reference
//   const reference = productLocation || (userLocation ? userLocation : null);

//   // Calculate coordinates
//   const userCoords = userLocation
//     ? getMapCoordinates(userLocation, reference)
//     : null;
//   const productCoords = productLocation
//     ? getMapCoordinates(productLocation, reference)
//     : null;

//   return (
//     <div className="border rounded-lg overflow-hidden bg-white">
//       <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
//         {/* Background grid */}
//         <defs>
//           <pattern
//             id="grid"
//             width="20"
//             height="20"
//             patternUnits="userSpaceOnUse"
//           >
//             <path
//               d="M 20 0 L 0 0 0 20"
//               fill="none"
//               stroke="gray"
//               strokeWidth="0.5"
//               opacity="0.2"
//             />
//           </pattern>
//         </defs>
//         <rect width={width} height={height} fill="url(#grid)" />

//         {/* Product location */}
//         {productCoords && (
//           <>
//             <circle
//               cx={productCoords.x}
//               cy={productCoords.y}
//               r="8"
//               fill="#4f46e5"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <text
//               x={productCoords.x + 12}
//               y={productCoords.y}
//               fontSize="12"
//               fill="#4f46e5"
//               fontWeight="bold"
//             >
//               Product
//             </text>
//           </>
//         )}

//         {/* User location */}
//         {userCoords && (
//           <>
//             <circle
//               cx={userCoords.x}
//               cy={userCoords.y}
//               r="6"
//               fill="#ef4444"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <text
//               x={userCoords.x + 12}
//               y={userCoords.y}
//               fontSize="12"
//               fill="#ef4444"
//               fontWeight="bold"
//             >
//               You
//             </text>
//           </>
//         )}

//         {/* Line connecting user and product */}
//         {userCoords && productCoords && (
//           <line
//             x1={userCoords.x}
//             y1={userCoords.y}
//             x2={productCoords.x}
//             y2={productCoords.y}
//             stroke="#9ca3af"
//             strokeWidth="1.5"
//             strokeDasharray="4 2"
//           />
//         )}
//       </svg>

//       {!userLocation && !productLocation && (
//         <div className="absolute inset-0 flex items-center justify-center text-gray-500">
//           No location data available
//         </div>
//       )}
//     </div>
//   );
// };

// export default IndoorMap;
