import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Plus, Camera, User, Edit, Trash2 } from "lucide-react";
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

const FamilySetup = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    photo: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load family members from localStorage
    const stored = localStorage.getItem("rememberme-family");
    if (stored) {
      setFamilyMembers(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (members: FamilyMember[]) => {
    localStorage.setItem("rememberme-family", JSON.stringify(members));
    setFamilyMembers(members);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewMember(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFamilyMember = () => {
    if (!newMember.name.trim() || !newMember.relationship.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both name and relationship.",
        variant: "destructive",
      });
      return;
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      relationship: newMember.relationship.trim(),
      photo: newMember.photo || undefined,
      memories: []
    };

    const updatedMembers = [...familyMembers, member];
    saveToStorage(updatedMembers);
    
    setNewMember({ name: "", relationship: "", photo: "" });
    setShowAddForm(false);
    
    toast({
      title: "Family member added",
      description: `${member.name} has been added to your family.`,
    });
  };

  const deleteFamilyMember = (id: string) => {
    const updatedMembers = familyMembers.filter(member => member.id !== id);
    saveToStorage(updatedMembers);
    
    toast({
      title: "Family member removed",
      description: "The family member has been removed.",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-soft p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl-care font-bold text-foreground mb-2">
              Family Setup
            </h1>
            <p className="text-lg text-muted-foreground">
              Add family members and their precious memories
            </p>
          </div>
          <Link to="/">
            <Button variant="secondary" size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
        </header>

        {/* Add Family Member Button */}
        {!showAddForm && (
          <div className="mb-8">
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="gap-2 text-xl-care py-6 px-8 shadow-warm hover:shadow-comfort"
            >
              <Plus className="w-6 h-6" />
              Add Family Member
            </Button>
          </div>
        )}

        {/* Add Member Form */}
        {showAddForm && (
          <Card className="p-8 mb-8 bg-card shadow-warm border-0">
            <h2 className="text-2xl-care font-semibold mb-6 text-card-foreground">
              Add New Family Member
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-medium">Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter their name"
                    className="text-lg p-4 mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="relationship" className="text-lg font-medium">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newMember.relationship}
                    onChange={(e) => setNewMember(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., daughter, son, wife, husband"
                    className="text-lg p-4 mt-2"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-medium mb-4 block">Photo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {newMember.photo ? (
                      <div className="space-y-4">
                        <img
                          src={newMember.photo}
                          alt="Preview"
                          className="w-32 h-32 rounded-full mx-auto object-cover shadow-soft"
                        />
                        <Button
                          variant="secondary"
                          onClick={() => setNewMember(prev => ({ ...prev, photo: "" }))}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <Button variant="secondary" className="gap-2" asChild>
                            <span>
                              <Camera className="w-4 h-4" />
                              Choose Photo
                            </span>
                          </Button>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button
                onClick={addFamilyMember}
                size="lg"
                className="gap-2 text-lg px-8"
              >
                <Plus className="w-5 h-5" />
                Add Family Member
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewMember({ name: "", relationship: "", photo: "" });
                }}
                size="lg"
                className="text-lg px-8"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Family Members Grid */}
        {familyMembers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map((member) => (
              <Card key={member.id} className="p-6 bg-card shadow-warm border-0 hover:shadow-comfort transition-all duration-300">
                <div className="text-center mb-4">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-soft"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-secondary flex items-center justify-center">
                      <User className="w-12 h-12 text-secondary-foreground" />
                    </div>
                  )}
                  
                  <h3 className="text-xl-care font-semibold text-card-foreground">
                    {member.name}
                  </h3>
                  <p className="text-lg text-muted-foreground capitalize">
                    {member.relationship}
                  </p>
                  
                  <div className="mt-4 text-sm">
                    <p className="text-muted-foreground">
                      {member.memories.length} {member.memories.length === 1 ? 'memory' : 'memories'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Link to={`/family/${member.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full gap-2">
                      <Edit className="w-4 h-4" />
                      Manage
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteFamilyMember(member.id)}
                    className="px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-gradient-comfort border-0 shadow-soft text-center">
            <User className="w-24 h-24 text-primary mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl-care font-semibold text-card-foreground mb-4">
              No family members yet
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Start by adding your first family member to create loving memories
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="gap-2 text-xl-care py-6 px-8"
            >
              <Plus className="w-6 h-6" />
              Add First Family Member
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
};

export default FamilySetup;