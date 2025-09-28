import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Home, Volume2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo?: string;
  memories: Memory[];
}

interface Memory {
  id: string;
  title: string;
  description: string;
  experience: string;
}

const PatientMode = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load family members from localStorage
    const stored = localStorage.getItem("rememberme-family");
    if (stored) {
      setFamilyMembers(JSON.parse(stored));
    }
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7; // Slower speech for clarity
      utterance.pitch = 1.1; // Slightly higher pitch for warmth
      utterance.volume = 0.9;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const findFamilyMember = (query: string): FamilyMember | null => {
    const lowerQuery = query.toLowerCase();
    
    // Look for relationship keywords
    const relationshipWords = ['daughter', 'son', 'wife', 'husband', 'mother', 'father', 'sister', 'brother', 'grandchild', 'grandson', 'granddaughter'];
    
    for (const word of relationshipWords) {
      if (lowerQuery.includes(word)) {
        const member = familyMembers.find(m => 
          m.relationship.toLowerCase().includes(word) || 
          m.relationship.toLowerCase() === word
        );
        if (member) return member;
      }
    }
    
    // Look for names
    for (const member of familyMembers) {
      if (lowerQuery.includes(member.name.toLowerCase())) {
        return member;
      }
    }
    
    return null;
  };

  const generateResponse = (member: FamilyMember): string => {
    if (member.memories.length === 0) {
      return `${member.name} is your loving ${member.relationship}. They care about you very much and visit you regularly.`;
    }
    
    // Select a random memory
    const randomMemory = member.memories[Math.floor(Math.random() * member.memories.length)];
    
    return `${member.name} is your ${member.relationship}. ${randomMemory.experience} You always feel so happy when you think about ${member.name}.`;
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setResponse("");
      setCurrentPhoto(null);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      
      // Process the request
      const member = findFamilyMember(text);
      if (member) {
        const responseText = generateResponse(member);
        setResponse(responseText);
        setCurrentPhoto(member.photo || null);
        speakText(responseText);
      } else {
        const fallbackResponse = "I'm here to help you remember your family. Try asking about your daughter, son, or other family members.";
        setResponse(fallbackResponse);
        speakText(fallbackResponse);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Couldn't hear you",
        description: "Please try speaking again.",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-soft p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl-care font-bold text-foreground">
            Hello! I'm here to help you remember
          </h1>
          <Link to="/">
            <Button variant="secondary" size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Voice Interface */}
          <div className="space-y-6">
            <Card className="p-8 text-center bg-gradient-comfort border-0 shadow-warm">
              <h2 className="text-2xl-care font-semibold mb-6 text-card-foreground">
                Ask me about your family
              </h2>
              
              <div className="mb-8">
                <Button
                  onClick={handleVoiceInput}
                  disabled={isListening || isSpeaking}
                  size="lg"
                  className={`w-40 h-40 rounded-full text-2xl-care font-bold shadow-comfort hover:shadow-warm transition-all duration-300 ${
                    isListening ? 'bg-destructive hover:bg-destructive animate-pulse' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-12 h-12 mb-2" />
                      Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="w-12 h-12 mb-2" />
                      Talk to me
                    </>
                  )}
                </Button>
              </div>

              {isSpeaking && (
                <Button
                  onClick={stopSpeaking}
                  variant="secondary"
                  size="lg"
                  className="gap-2 mb-4"
                >
                  <Volume2 className="w-5 h-5" />
                  Stop Speaking
                </Button>
              )}

              <div className="text-left space-y-4">
                {transcript && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-lg font-medium text-secondary-foreground">You said:</p>
                    <p className="text-xl-care text-foreground mt-2">"{transcript}"</p>
                  </div>
                )}

                {response && (
                  <div className="p-6 bg-accent rounded-lg">
                    <p className="text-xl-care leading-relaxed text-accent-foreground">
                      {response}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Sample prompts */}
            <Card className="p-6 bg-card shadow-soft border-0">
              <h3 className="text-xl-care font-semibold mb-4 text-card-foreground">
                Try asking:
              </h3>
              <ul className="space-y-2 text-lg text-muted-foreground">
                <li>"Tell me about my daughter"</li>
                <li>"Who is Sarah?"</li>
                <li>"Tell me about my son"</li>
                <li>"Who visits me?"</li>
              </ul>
            </Card>
          </div>

          {/* Photo Display */}
          <div className="space-y-6">
            {currentPhoto ? (
              <Card className="p-6 bg-card shadow-warm border-0">
                <img
                  src={currentPhoto}
                  alt="Family member"
                  className="w-full h-96 object-cover rounded-lg shadow-soft"
                />
              </Card>
            ) : (
              <Card className="p-12 bg-gradient-comfort border-0 shadow-soft text-center">
                <Heart className="w-24 h-24 text-primary mx-auto mb-6 opacity-50" />
                <p className="text-xl-care text-muted-foreground">
                  Family photos will appear here when you ask about someone
                </p>
              </Card>
            )}

            {/* Family overview */}
            {familyMembers.length > 0 && (
              <Card className="p-6 bg-card shadow-soft border-0">
                <h3 className="text-xl-care font-semibold mb-4 text-card-foreground">
                  Your loving family:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="text-center">
                      {member.photo && (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2 object-cover shadow-soft"
                        />
                      )}
                      <p className="font-medium text-card-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{member.relationship}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PatientMode;