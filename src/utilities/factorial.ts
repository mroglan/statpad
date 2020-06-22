

export default function factorial(num:number) {
    if(num <= 1 || isNaN(num)) return 1
    return num * factorial(num - 1)
}