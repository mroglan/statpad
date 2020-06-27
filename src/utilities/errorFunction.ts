

export default function errorFunction(z:number) {
    
    return (2 / Math.sqrt(Math.PI)) * (z - (Math.pow(z, 3) / 3) + (Math.pow(z, 5) / 10) - (Math.pow(z, 7) / 42) + (Math.pow(z, 9) / 216) 
    - (Math.pow(z, 11) / 1320) + (Math.pow(z, 13)/ 9360) - (Math.pow(z, 15) / 75600) + (Math.pow(z, 17) / 685440)
    - (Math.pow(z, 19) / 6894720) + (Math.pow(z, 21) / 76204800) )
}