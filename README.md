# ExamRanger - AI-Powered Exam Platform

A modern web application for creating, managing, and taking exams with AI-powered question generation based on syllabus input.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - Secure login/register system with role-based access
- **Subject Management** - Create and manage subjects with comprehensive syllabus input
- **AI-Powered Question Generation** - Automatically generate 30 questions based on syllabus using AI
- **Exam Creation & Management** - Create exams with AI-generated or manual questions
- **Real-time Exam Taking** - Interactive exam interface with timer and progress tracking
- **Results & Analytics** - Detailed exam results with scoring, rankings, and feedback
- **Responsive Design** - Modern UI that works on desktop and mobile devices

### AI Integration
- **Syllabus-Based Question Generation** - AI analyzes syllabus content to create relevant questions
- **Multiple Question Types** - Various question formats based on syllabus topics
- **Explanation Generation** - AI provides explanations for correct answers
- **Validation System** - Ensures syllabus quality for optimal AI processing

### Admin Features
- **Subject Management Dashboard** - Add, edit, and delete subjects with syllabus
- **Exam Management** - Create, edit, and manage exams with AI-generated questions
- **User Management** - View and manage user accounts and permissions
- **Analytics Dashboard** - Comprehensive statistics and performance metrics

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications
- **Build Tool**: Vite
- **AI Integration**: Custom AI service (easily replaceable with OpenAI, Claude, etc.)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd examranger
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### For Administrators

1. **Create Subjects**
   - Navigate to Admin Dashboard → Subjects
   - Click "Add New Subject"
   - Enter subject name and comprehensive syllabus
   - Separate topics with commas for better AI understanding

2. **Generate AI Questions**
   - Create a new exam
   - Select a subject
   - Click "AI Generate" to create 30 questions automatically
   - Review and edit questions as needed

3. **Manage Exams**
   - Create exams with AI-generated or manual questions
   - Set duration, description, and active status
   - Monitor exam results and user performance

### For Users

1. **Browse Exams**
   - View available exams by subject
   - Search and filter exams
   - See exam details and requirements

2. **Take Exams**
   - Start exams with timer
   - Answer questions with multiple choice options
   - Submit and view results immediately

3. **Track Progress**
   - View exam history and scores
   - See performance analytics
   - Check rankings and feedback

## 🔧 Configuration

### AI Service Integration

The app includes a mock AI service that can be easily replaced with real AI APIs:

1. **Replace AI Service** (`src/lib/ai-service.ts`)
   ```typescript
   // Example OpenAI integration
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   
   public async generateQuestions(
     subjectName: string,
     syllabus: string,
     count: number = 30
   ): Promise<Question[]> {
     const completion = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [
         {
           role: "system",
           content: `Generate ${count} multiple choice questions based on this syllabus: ${syllabus}`
         }
       ],
     });
     
     // Parse and return questions
     return parseQuestions(completion.choices[0].message.content);
   }
   ```

2. **Environment Variables**
   ```env
   VITE_AI_API_KEY=your_api_key_here
   VITE_AI_SERVICE_URL=your_service_url
   ```

### Customization

- **Styling**: Modify Tailwind CSS classes in components
- **Validation**: Update Zod schemas for form validation
- **AI Prompts**: Customize question generation prompts in AI service
- **Question Types**: Add new question formats in the AI service

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── exams/           # Exam-related components
│   ├── layout/          # Layout components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts for state management
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and services
├── pages/               # Page components
└── main.tsx            # Application entry point
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@examranger.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] Real-time collaboration for exam creation
- [ ] Advanced analytics and reporting
- [ ] Integration with learning management systems
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced AI features (adaptive testing, personalized questions)
- [ ] Video and multimedia question support
- [ ] Offline exam taking capability 