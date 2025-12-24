import { BsGoogle, BsGithub } from 'react-icons/bs'
import { Button } from "../ui/button"
import { CardFooter } from "../ui/card"
import { Separator } from '../ui/separator'

const SocialButtons = () => {
    return <CardFooter>
        <div className="grid grid-cols-2 gap-2 w-full">
            <Separator className='col-span-2 my-2' />
            <Button variant='outline' className='cursor-pointer'>
                <BsGoogle className='size-4' />
                <span>Goggle</span>
            </Button>
            <Button variant='outline' className='cursor-pointer'>
                <BsGithub className='size-4' />
                <span>Github</span>
            </Button>
        </div>
    </CardFooter>
}

export default SocialButtons