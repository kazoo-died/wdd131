


document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;


const temperature = parseFloat(document.getElementById("temp").textContent);
const windSpeed = parseFloat(document.getElementById("wind").textContent);


function calculateWindChill(tempC, windKmh) {
  return (
    13.12 +
    0.6215 * tempC -
    11.37 * Math.pow(windKmh, 0.16) +
    0.3965 * tempC * Math.pow(windKmh, 0.16)
  ).toFixed(1);
}


let windChillText = "N/A";
if (temperature <= 10 && windSpeed > 4.8) {
  windChillText = calculateWindChill(temperature, windSpeed) + " °C";
}

document.getElementById("windchill").textContent = windChillText;
