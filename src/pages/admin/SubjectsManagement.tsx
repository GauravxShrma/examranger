import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubjectForm } from '@/components/admin/SubjectForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExam } from '@/contexts/ExamContext';
import { BookOpen, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const SubjectsManagement: React.FC = () => {
  const { subjects, deleteSubject } = useExam();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      deleteSubject(subjectId);
      toast.success('Subject deleted successfully');
    }
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  return (
    <MainLayout requireAuth>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Subjects</h1>
            <p className="text-gray-600">Add and manage your subjects with syllabus for AI-powered exam generation</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Subject
          </Button>
        </div>

        {!showForm ? (
          <>
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">All Subjects</h2>
                <p className="text-gray-500">Total: {subjects.length} subjects</p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Subject
              </Button>
            </div>

            {/* Subjects Grid */}
            {subjects.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first subject to start generating AI-powered exam questions.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Subject
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-brand-600" />
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSubject(subject)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          Created: {new Date(subject.createdAt).toLocaleDateString()}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Syllabus Topics:</h4>
                          <div className="flex flex-wrap gap-1">
                            {subject.syllabus.split(',').slice(0, 5).map((topic, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {topic.trim()}
                              </Badge>
                            ))}
                            {subject.syllabus.split(',').length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{subject.syllabus.split(',').length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleEditSubject(subject)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Subject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleCancelForm}
                className="mb-4"
              >
                ← Back to Subjects
              </Button>
              <h2 className="text-xl font-semibold">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
            </div>
            <SubjectForm onSuccess={handleFormSuccess} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SubjectsManagement;
