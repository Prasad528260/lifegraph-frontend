import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'src');

const files = [
    'app/store.js',
    'features/auth/authSlice.js',
    'features/capsule/capsuleSlice.js',
    'features/graph/graphSlice.js',
    'features/institution/institutionSlice.js',
    'features/trust/trustSlice.js',
    'features/access/accessSlice.js',
    'features/logs/logsSlice.js',
    'hooks/useAuth.js',
    'hooks/useAdmin.js',
    'hooks/useGraph.js',
    'services/api.js',
    'components/Navbar.jsx',
    'components/ProtectedRoute.jsx',
    'components/AdminRoute.jsx',
    'components/GraphView.jsx',
    'components/CapsuleForm.jsx',
    'components/InstitutionCard.jsx',
    'components/TrustBadge.jsx',
    'components/AccessResult.jsx',
    'components/LogsTable.jsx',
    'layouts/MainLayout.jsx',
    'pages/Login.jsx',
    'pages/Register.jsx',
    'pages/UserDashboard.jsx',
    'pages/AdminDashboard.jsx',
    'pages/AccessSimulator.jsx',
    'pages/LogsPage.jsx',
    'utils/tokenHelper.js',
    'App.jsx',
    'main.jsx'
];

files.forEach(f => {
    const fullPath = path.join(basePath, f);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '');
    }
});

console.log("Successfully created folder structure and files!");
