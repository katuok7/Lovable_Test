
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Database, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Person {
  id: string;
  name: string;
  age: number;
  createdAt: string;
}

const Index = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [showDatabase, setShowDatabase] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPeople = localStorage.getItem('peopleDatabase');
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    }
  }, []);

  // Save to localStorage whenever people array changes
  useEffect(() => {
    localStorage.setItem('peopleDatabase', JSON.stringify(people));
  }, [people]);

  const addPerson = () => {
    if (!name.trim() || !age.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and age",
        variant: "destructive"
      });
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid age",
        variant: "destructive"
      });
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      name: name.trim(),
      age: ageNum,
      createdAt: new Date().toLocaleDateString()
    };

    setPeople([...people, newPerson]);
    setName('');
    setAge('');
    
    toast({
      title: "Success",
      description: `${name} has been added to the database!`,
    });
  };

  const deletePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    toast({
      title: "Deleted",
      description: "Person removed from database",
    });
  };

  const startEdit = (person: Person) => {
    setEditingId(person.id);
    setEditName(person.name);
    setEditAge(person.age.toString());
  };

  const saveEdit = () => {
    if (!editName.trim() || !editAge.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and age",
        variant: "destructive"
      });
      return;
    }

    const ageNum = parseInt(editAge);
    if (isNaN(ageNum) || ageNum < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid age",
        variant: "destructive"
      });
      return;
    }

    setPeople(people.map(person => 
      person.id === editingId 
        ? { ...person, name: editName.trim(), age: ageNum }
        : person
    ));
    
    setEditingId(null);
    setEditName('');
    setEditAge('');
    
    toast({
      title: "Updated",
      description: "Person information updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditAge('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">People Database</h1>
          <p className="text-gray-600">Add people to your database and manage the records</p>
        </div>

        {/* Input Form */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New Person
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addPerson}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Person
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Toggle */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowDatabase(!showDatabase)}
            variant="outline"
            className="bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 hover:text-blue-700"
          >
            {showDatabase ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showDatabase ? 'Hide' : 'Show'} Database ({people.length} records)
          </Button>
        </div>

        {/* Database View */}
        {showDatabase && (
          <Card className="shadow-lg">
            <CardHeader className="bg-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Records
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {people.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No records found</p>
                  <p className="text-gray-400">Add some people to see them here!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Age</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Added</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((person) => (
                        <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">
                            {editingId === person.id ? (
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              <span className="font-medium text-gray-800">{person.name}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {editingId === person.id ? (
                              <Input
                                type="number"
                                value={editAge}
                                onChange={(e) => setEditAge(e.target.value)}
                                className="w-20"
                              />
                            ) : (
                              <span className="text-gray-600">{person.age}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="text-gray-500 text-sm">{person.createdAt}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {editingId === person.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={saveEdit}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(person)}
                                    className="hover:bg-blue-50"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deletePerson(person.id)}
                                    className="hover:bg-red-50 text-red-600 border-red-200"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
