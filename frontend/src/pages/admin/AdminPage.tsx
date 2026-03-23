import Navbar from '../../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Admin özellikleri yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}