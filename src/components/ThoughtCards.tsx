import { Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
export default function ThoughtCards(){
    return (
        <div className="flex ">
        <div>
    <Textarea className="w-75 h-25 shadow-xl focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-pink-200 transition-all" placeholder="What’s on your mind right now?"/>
       <div className="flex items-center justify-center h-20">
    <Button variant="outline" className="bg-blue-500 text-white px-4 py-2 rounded">
    Add thought
     </Button>
   </div>
    </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 h-[400px] bg-gray-50">
      
      {/* Worries */}
      <Card className="bg-blue-100">
        <CardHeader>
          <CardTitle>😟 Worries</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section is for things you’re anxious about.</p>
        </CardContent>
      </Card>

      {/* What I Can Control */}
      <Card className="bg-green-100">
        <CardHeader>
          <CardTitle>✅ What I Can Control</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Focus on actions you can take today.</p>
        </CardContent>
      </Card>

      {/* What I Can’t Control */}
      <Card className="bg-gray-100">
        <CardHeader>
          <CardTitle>🚫 What I Can’t Control</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Let go of things beyond your control.</p>
        </CardContent>
      </Card>
    </div>
    </div>
    )
}