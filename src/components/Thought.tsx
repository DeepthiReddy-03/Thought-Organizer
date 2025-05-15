import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
export default function Thought() {
  return(
    <div>
    <Textarea className="w-75 h-25 shadow-xl focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-pink-200 transition-all" placeholder="What’s on your mind right now?"/>
       <div className="flex items-center justify-center h-20">
    <Button variant="outline" className="bg-blue-500 text-white px-4 py-2 rounded">
    Add thought
     </Button>
   </div>
    </div>
  )
}
