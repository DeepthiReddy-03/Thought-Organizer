'use client'
import { Card, CardTitle, CardHeader, CardContent} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from 'react'
export default function Page() {
  type ThoughtWithReflection = {
    id: number;
    text: string;
    reflectionPrompt: string;
    reflectionResponse?: string;
  };
  const [inputThought, setInputThought] = useState("");
  const [newThoughts, setNewThoughts] = useState<{ id: number; text: string }[]>([]);
  const [worries, setWorries] = useState<ThoughtWithReflection[]>([]);
  const [controllables, setControllables] = useState<ThoughtWithReflection[]>([]);
  const [uncontrollables, setUncontrollables] = useState<ThoughtWithReflection[]>([]);

  // For confirmation dialog
  const [showDialog, setShowDialog] = useState(false);
  const [pendingThought, setPendingThought] = useState<{ id: number; text: string } | null>(null);
  const [targetCategory, setTargetCategory] = useState<"worries" | "controllables" | "uncontrollables" | null>(null);
  // For Reflection prompt
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionPrompt, setReflectionPrompt] = useState("");
  const [reflectionResponse, setReflectionResponse] = useState("");
  // For feedback dialog
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");


  const handleAddThought = () => {
    if (inputThought.trim()) {
      const newThought = {
        id: Date.now(), // unique ID
        text: inputThought.trim()
      };
      setNewThoughts([...newThoughts, newThought]);
      setInputThought("");
    }
  };
  const handleDropToCategory = (
      e: React.DragEvent<HTMLDivElement>,
      category: "worries" | "controllables" | "uncontrollables"
    ) => {
      e.preventDefault();
      const thoughtId = parseInt(e.dataTransfer.getData("thoughtId"));
      const droppedThought = newThoughts.find((t) => t.id === thoughtId);

      if (droppedThought) {
        setPendingThought(droppedThought);
        setTargetCategory(category);
        setShowDialog(true);
      }
    };

      const handleConfirmDrop = () => {
          if (!pendingThought || !targetCategory) return;

          // Set reflection prompt
          let prompt = "";
          switch (targetCategory) {
            case "worries":
              prompt = "How does it feel to acknowledge this worry?";
              break;
            case "controllables":
              prompt = "What small step can you take to address this thought?";
              break;
            case "uncontrollables":
              prompt = "Take a deep breath and let go of what you can’t control.";
              break;
          }

          setReflectionPrompt(prompt);
          setShowDialog(false); // Close confirmation
          setShowReflection(true); // Open reflection
        };

  const handleCancelDrop = () => {
    // Simply reset the dialog state
    setShowDialog(false);
    setPendingThought(null);
    setTargetCategory(null);
  };
  
  const handleFinalizeCategorization = () => {
      if (!pendingThought || !targetCategory) return;

      const categorizedThought: ThoughtWithReflection = {
        id: pendingThought.id,
        text: pendingThought.text,
        reflectionPrompt: reflectionPrompt,
        reflectionResponse: reflectionResponse.trim() || undefined, // optional
      };

      if (targetCategory === "worries") {
        setWorries((prev) => [...prev, categorizedThought]);
      } else if (targetCategory === "controllables") {
        setControllables((prev) => [...prev, categorizedThought]);
      } else if (targetCategory === "uncontrollables") {
        setUncontrollables((prev) => [...prev, categorizedThought]);
      }

      // Remove from unsorted
      setNewThoughts((prev) => prev.filter((t) => t.id !== pendingThought.id));

      // Reset reflection UI
      setPendingThought(null);
      setTargetCategory(null);
      setShowReflection(false);
      setReflectionPrompt("");
      setReflectionResponse("");
      
      // Show feedback dialog
      setFeedbackMessage(getFeedbackMessage(targetCategory));
      setShowFeedback(true);

    };
  const getFeedbackMessage = (category: "worries" | "controllables" | "uncontrollables") => {
      switch (category) {
        case "worries":
          return "Great job letting go of that worry! You can't control everything, but you can choose how you react.";
        case "controllables":
          return "Awesome! You picked something you can do. Even small steps can make a big difference!";
        case "uncontrollables":
          return "It's brave to notice what you can't control. Take a deep breath and let it go.";
        default:
          return "";
      }
    };




  return (
    <div>
      <h1 className="text-4xl font-semibold text-center pt-5 uppercase">Thought Organizer</h1> 
      <h4 className="text-xl font-light italic text-center text-gray-900 pt-2">Add your thoughts and sort them into categories to gain perspective</h4>
      <div className="flex h-screen mt-8">
        <div className="flex ">
          <div className="pl-6">
                <Textarea 
                  value={inputThought}
                  onChange={(e) => setInputThought(e.target.value)}
                  className="w-75 h-25 shadow-xl focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-pink-200 transition-all" 
                  placeholder="What’s on your mind right now?"
                />
                <div className="flex items-center justify-center h-20">
                  <Button
                      onClick={handleAddThought} 
                      variant="outline" className="bg-blue-500 text-white px-4 py-2 rounded">
                      Add thought
                  </Button>
                </div>
                <div className="max-w-80">
                      {newThoughts.length > 0 && <h2 className="text-center pb-4 text-lg font-medium">New Thoughts</h2>}
                      <ul className="space-y-3">
                        {newThoughts.map((thought) => (
                          <li
                            key={thought.id}
                            draggable
                            onDragStart={(e) =>
                              e.dataTransfer.setData("thoughtId", thought.id.toString())
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 cursor-move"
                          >
                            {thought.text}
                          </li>
                        ))}
                      </ul>
                </div>
          </div>
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 h-[400px] bg-gray-50">
      
                  {/* Worries */}
                 <Card
                    className="bg-blue-100 max-w-100 overflow-y-auto max-h-100"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropToCategory(e, "worries")}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">😟 Worries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>This section is for things you’re anxious about.</p>

                      <ul className="mt-3 list-none space-y-2">
                        {worries.map((item) => (
                          <li
                            key={item.id}
                            className="px-3 py-2 bg-white border border-blue-300 rounded shadow-sm text-sm"
                          >
                            <p className="text-gray-800 font-medium">💭 {item.text}</p>

                            {item.reflectionPrompt && (
                              <p className="text-gray-600 italic mt-1">
                                ✨ {item.reflectionPrompt}
                              </p>
                            )}

                            {item.reflectionResponse && (
                              <p className="ml-2 italic text-gray-700 mt-1">
                                📝 {item.reflectionResponse}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>



                  {/* What I Can Control */}
                  <Card
                      className="bg-green-100 max-w-100 overflow-y-auto max-h-100"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropToCategory(e, "controllables")}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">✅ What I Can Control</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Focus on actions you can take today.</p>

                        <ul className="mt-3 list-none space-y-2">
                          {controllables.map((item) => (
                            <li
                              key={item.id}
                              className="px-3 py-2 bg-white border border-green-300 rounded shadow-sm text-sm"
                            >
                              <p className="text-gray-800 font-medium">💭 {item.text}</p>
                              {item.reflectionPrompt && (
                                <p className="text-gray-600 italic mt-1">✨ {item.reflectionPrompt}</p>
                              )}
                              {item.reflectionResponse && (
                                <p className="ml-2 italic text-gray-700 mt-1">📝 {item.reflectionResponse}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                  {/* What I Can’t Control */}
                  <Card
                      className="bg-gray-100 max-w-100 overflow-y-auto max-h-100"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropToCategory(e, "uncontrollables")}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">🚫 What I Can’t Control</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Let go of things beyond your control.</p>

                        <ul className="mt-3 list-none space-y-2">
                          {uncontrollables.map((item) => (
                            <li
                              key={item.id}
                              className="px-3 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm"
                            >
                              <p className="text-gray-800 font-medium">💭 {item.text}</p>
                              {item.reflectionPrompt && (
                                <p className="text-gray-600 italic mt-1">✨ {item.reflectionPrompt}</p>
                              )}
                              {item.reflectionResponse && (
                                <p className="ml-2 italic text-gray-700 mt-1">📝 {item.reflectionResponse}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>


          </div>
               <div className="pl-3 pt-3 border mx-6 mt-6 rounded-lg pb-2">
                  <h1 className="text-2xl">Thoughts summary</h1>
                  <div className="flex gap-x-6 pr-3 pt-2 italic">
                       {newThoughts.length > 0 && (
                          <h2 className="text-center pb-4 text-lg font-medium">
                            {newThoughts.length} <span className="text-gray-500 ">Unsorted thoughts</span> 
                          </h2>
                        )}
                        {worries.length > 0 && (
                          <h2 className="text-center pb-4 text-lg font-medium">
                          <span className="text-gray-500 ">😟 Worries :</span> {worries.length}  
                          </h2>
                        )}
                        {controllables.length > 0 && (
                          <h2 className="text-center pb-4 text-lg font-medium">
                            <span className="text-gray-500 ">✅ Things you can control :</span> {controllables.length} 
                          </h2>
                        )}
                        {uncontrollables.length > 0 && (
                          <h2 className="text-center pb-4 text-lg font-medium">
                            <span className="text-gray-500 ">🚫 Things you can't control :</span> {uncontrollables.length} 
                          </h2>
                        )}
                  </div>
                </div>
          </div>
        </div>
      </div>
      {showDialog && pendingThought && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6">
              <DialogHeader>
                <DialogTitle>Is '{targetCategory}' the right place for this thought?</DialogTitle>
                <DialogDescription className="py-2 italic text-gray-600">
                  “{pendingThought.text}”
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={handleCancelDrop}>No</Button>
                <Button variant="outline" onClick={handleConfirmDrop}>Yes</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {showReflection && pendingThought && (
          <Dialog open={showReflection} onOpenChange={setShowReflection}>
            <DialogContent className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Reflection</DialogTitle>
                <DialogDescription className="italic text-gray-600 mt-2">{reflectionPrompt}</DialogDescription>
              </DialogHeader>

              {/* Textbox Option */}
              <Textarea
                placeholder="Write your response..."
                value={reflectionResponse}
                onChange={(e) => setReflectionResponse(e.target.value)}
                className="mt-4"
              />
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => handleFinalizeCategorization()}>Skip</Button>
                <Button variant="outline" onClick={() => handleFinalizeCategorization()}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      
      {showFeedback && (
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Message</DialogTitle>
              <DialogDescription className="text-gray-700 mt-2">
                {feedbackMessage}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowFeedback(false)} className="bg-blue-500 text-white">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}


    </div>    
  )
}