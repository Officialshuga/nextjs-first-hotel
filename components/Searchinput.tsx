"use client"
import qs from "query-string"
import React, { ChangeEventHandler } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounceValue } from "@/hooks/useDebounceValue"

const Searchinput = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get("title")
  const pathname = usePathname()
  const router = useRouter()


  const [value, setValue] = React.useState(title || "")
  const debounceValue = useDebounceValue<string>(value)
  React.useEffect(()=>{
    const query = {
      title: debounceValue
    }
    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, {skipNull: true, skipEmptyString: true})
    // console.log('url' , url)
    router.push(url)
  }, [debounceValue, router])

  const onChange: ChangeEventHandler<HTMLInputElement> = (e)=>{
    setValue(e.target.value)
  }
  // if(pathname === "/") return null;
  return (
    <div className='relative sm:block hidden'>
        <Search className='absolute h-4 w-4 top-3 left-4 text-muted-foreground'/>
        <Input value={value} onChange={onChange} placeholder='Search' className='pl-10 bg-primary/10'/>
    </div>
  )
}

export default Searchinput
