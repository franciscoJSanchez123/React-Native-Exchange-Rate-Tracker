

const PriceInstagram= async ()=>{
    

    
    const data =await fetch('http://192.168.250.4:3000/price/Instagram')
    const res=await data.json()   
    console.log(res)
    return res
}

export default PriceInstagram;