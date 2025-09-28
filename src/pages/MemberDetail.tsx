import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2, User, Heart } from "lucide-react";
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

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    experience: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    const stored = localStorage.getItem("rememberme-family");
    if (stored) {
      const familyMembers: FamilyMember[] = JSON.parse(stored);
      const foundMember = familyMembers.find(m => m.id === id);
      if (foundMember) {
        setMember(foundMember);
      } else {
        navigate("/family");
      }
    }
  }, [id, navigate]);

  const saveMembers = (updatedMembers: FamilyMember[]) => {
    localStorage.setItem("rememberme-family", JSON.stringify(updatedMembers));
  };

  const addMemory = () => {
    if (!member || !newMemory.title.trim() || !newMemory.experience.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter at least a title and experience.",
        variant: "destructive",
      });
      return;
    }

    const memory: Memory = {
      id: Date.now().toString(),
      title: newMemory.title.trim(),
      description: newMemory.description.trim(),
      experience: newMemory.experience.trim()
    };

    const stored = localStorage.getItem("rememberme-family");
    if (stored) {
      const familyMembers: FamilyMember[] = JSON.parse(stored);
      const updatedMembers = familyMembers.map(m => 
        m.id === member.id 
          ? { ...m, memories: [...m.memories, memory] }
          : m
      );
      
      saveMembers(updatedMembers);
      setMember(prev => prev ? { ...prev, memories: [...prev.memories, memory] } : null);
      setNewMemory({ title: "", description: "", experience: "" });
      setShowAddMemory(false);
      
      toast({
        title: "Memory added",
        description: "A new loving memory has been saved.",
      });
    }
  };

  const updateMemory = (memoryId: string) => {
    if (!member || !newMemory.title.trim() || !newMemory.experience.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter at least a title and experience.",
        variant: "destructive",
      });
      return;
    }

    const stored = localStorage.getItem("rememberme-family");
    if (stored) {
      const familyMembers: FamilyMember[] = JSON.parse(stored);
      const updatedMembers = familyMembers.map(m => 
        m.id === member.id 
          ? { 
              ...m, 
              memories: m.memories.map(mem => 
                mem.id === memoryId 
                  ? { ...mem, title: newMemory.title.trim(), description: newMemory.description.trim(), experience: newMemory.experience.trim() }
                  : mem
              )
            }
          : m
      );
      
      saveMembers(updatedMembers);
      setMember(prev => prev ? { 
        ...prev, 
        memories: prev.memories.map(mem => 
          mem.id === memoryId 
            ? { ...mem, title: newMemory.title.trim(), description: newMemory.description.trim(), experience: newMemory.experience.trim() }
            : mem
        )
      } : null);
      
      setNewMemory({ title: "", description: "", experience: "" });
      setEditingMemory(null);
      
      toast({
        title: "Memory updated",
        description: "The memory has been updated successfully.",
      });
    }
  };

  const deleteMemory = (memoryId: string) => {
    if (!member) return;

    const stored = localStorage.getItem("rememberme-family");
    if (stored) {
      const familyMembers: FamilyMember[] = JSON.parse(stored);
      const updatedMembers = familyMembers.map(m => 
        m.id === member.id 
          ? { ...m, memories: m.memories.filter(mem => mem.id !== memoryId) }
          : m
      );
      
      saveMembers(updatedMembers);
      setMember(prev => prev ? { 
        ...prev, 
        memories: prev.memories.filter(mem => mem.id !== memoryId)
      } : null);
      
      toast({
        title: "Memory removed",
        description: "The memory has been removed.",
      });
    }
  };

  const startEditMemory = (memory: Memory) => {
    setNewMemory({
      title: memory.title,
      description: memory.description,
      experience: memory.experience
    });
    setEditingMemory(memory.id);
    setShowAddMemory(false);
  };

  const cancelEdit = () => {
    setNewMemory({ title: "", description: "", experience: "" });
    setEditingMemory(null);
    setShowAddMemory(false);
  };

  if (!member) {
    return (
      <main className="min-h-screen bg-gradient-soft p-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-soft p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Link to="/family">
            <Button variant="secondary" size="lg" className="gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Family
            </Button>
          </Link>
          
          <div className="flex-1">
            <h1 className="text-3xl-care font-bold text-foreground">
              {member.name}'s Memories
            </h1>
            <p className="text-lg text-muted-foreground capitalize">
              Your loving {member.relationship}
            </p>
          </div>
        </header>

        {/* Member Info Card */}
        <Card className="p-8 mb-8 bg-gradient-comfort border-0 shadow-warm">
          <div className="flex items-center gap-6">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover shadow-soft"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-12 h-12 text-secondary-foreground" />
              </div>
            )}
            
            <div>
              <h2 className="text-2xl-care font-semibold text-card-foreground mb-2">
                {member.name}
              </h2>
              <p className="text-xl-care text-muted-foreground capitalize mb-2">
                {member.relationship}
              </p>
              <p className="text-lg text-muted-foreground">
                {member.memories.length} {member.memories.length === 1 ? 'memory' : 'memories'} saved
              </p>
            </div>
          </div>
        </Card>

        {/* Add Memory Button */}
        {!showAddMemory && !editingMemory && (
          <div className="mb-8">
            <Button
              onClick={() => setShowAddMemory(true)}
              size="lg"
              className="gap-2 text-xl-care py-6 px-8 shadow-warm hover:shadow-comfort"
            >
              <Plus className="w-6 h-6" />
              Add New Memory
            </Button>
          </div>
        )}

        {/* Add/Edit Memory Form */}
        {(showAddMemory || editingMemory) && (
          <Card className="p-8 mb-8 bg-card shadow-warm border-0">
            <h2 className="text-2xl-care font-semibold mb-6 text-card-foreground">
              {editingMemory ? 'Edit Memory' : 'Add New Memory'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-lg font-medium">Memory Title</Label>
                <Input
                  id="title"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Beach vacation with Sarah"
                  className="text-lg p-4 mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-lg font-medium">Short Description</Label>
                <Input
                  id="description"
                  value={newMemory.description}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., A wonderful day at the beach"
                  className="text-lg p-4 mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="experience" className="text-lg font-medium">Detailed Experience *</Label>
                <Textarea
                  id="experience"
                  value={newMemory.experience}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Describe the memory in detail. This will be read aloud to provide comfort. For example: 'You spent a beautiful day at the beach with Sarah. You built amazing sandcastles together and collected seashells. You were laughing and having so much fun. Sarah said it was one of her favorite days with you.'"
                  className="text-lg p-4 mt-2 min-h-32"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This detailed description will be read aloud to provide comfort and help recall the memory.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => editingMemory ? updateMemory(editingMemory) : addMemory()}
                size="lg"
                className="gap-2 text-lg px-8"
              >
                <Heart className="w-5 h-5" />
                {editingMemory ? 'Update Memory' : 'Save Memory'}
              </Button>
              <Button
                variant="secondary"
                onClick={cancelEdit}
                size="lg"
                className="text-lg px-8"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Memories List */}
        {member.memories.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl-care font-semibold text-foreground">
              Saved Memories
            </h2>
            
            {member.memories.map((memory) => (
              <Card key={memory.id} className="p-6 bg-card shadow-soft border-0 hover:shadow-warm transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl-care font-semibold text-card-foreground mb-2">
                      {memory.title}
                    </h3>
                    {memory.description && (
                      <p className="text-lg text-muted-foreground mb-4">
                        {memory.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => startEditMemory(memory)}
                      className="gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMemory(memory.id)}
                      className="px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-lg leading-relaxed text-accent-foreground">
                    {memory.experience}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-gradient-comfort border-0 shadow-soft text-center">
            <Heart className="w-24 h-24 text-primary mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl-care font-semibold text-card-foreground mb-4">
              No memories yet
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Add your first loving memory of {member.name} to help bring comfort and joy
            </p>
            <Button
              onClick={() => setShowAddMemory(true)}
              size="lg"
              className="gap-2 text-xl-care py-6 px-8"
            >
              <Plus className="w-6 h-6" />
              Add First Memory
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
};

export default MemberDetail;