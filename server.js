import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 3030;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public'), { 
    setHeaders: (res, filePath) => {
        const extension = path.extname(filePath);
        if (extension === '.js') {
            res.setHeader('Content-Type', 'text/javascript');
        }
    }
}));

const allowedPages = ['dashboard.html', 'employee_list.html', 'employee-turnover.html', 'view_board.html', 'view_board_detail.html', ];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'dashboard.html'));
});

allowedPages.forEach(page => {
    app.get('/' + page, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'html', page));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:3030`);
});