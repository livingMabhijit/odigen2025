const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files except HTML
app.use(express.static(__dirname, {
    index: false,
    extensions: ['js', 'css', 'png', 'jpg', 'gif']
}));

// Serve files from schedules directory
app.use('/schedules', express.static(path.join(__dirname, 'schedules'), {
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.pdf') {
            res.set('Content-Type', 'application/pdf');
            res.set('Content-Disposition', 'attachment; filename="Phase schedule T$O 2025.pdf"');
        }
    }
}));

// Home page route
app.get('/', async (req, res) => {
    try {
        const content = await injectNavigation(path.join(__dirname, 'index.html'));
        res.send(content);
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).send('Error loading page');
    }
});

// Function to inject navigation into HTML pages
async function injectNavigation(htmlPath) {
    try {
        const navContent = await fs.promises.readFile(path.join(__dirname, 'components', 'nav.html'), 'utf8');
        let pageContent = await fs.promises.readFile(htmlPath, 'utf8');
        
        // Insert navigation after <body> tag
        pageContent = pageContent.replace('<body>', '<body>' + navContent);
        
        // Add Font Awesome and script.js if not present
        if (!pageContent.includes('font-awesome')) {
            pageContent = pageContent.replace('</head>',
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n</head>');
        }
        
        // Ensure script.js is included before closing body tag
        if (!pageContent.includes('script.js')) {
            pageContent = pageContent.replace('</body>', '<script src="/script.js"></script>\n</body>');
        }
        
        return pageContent;
    } catch (error) {
        console.error('Error injecting navigation:', error);
        throw error;
    }
}

// Serve static pages with navigation
app.get('/schedule', async (req, res) => {
    try {
        const content = await injectNavigation(path.join(__dirname, 'pages', 'schedule.html'));
        res.send(content);
    } catch (error) {
        res.status(500).send('Error loading page');
    }
});

app.get('/instructions', async (req, res) => {
    try {
        const content = await injectNavigation(path.join(__dirname, 'pages', 'instructions.html'));
        res.send(content);
    } catch (error) {
        res.status(500).send('Error loading page');
    }
});

app.get('/evaluation', async (req, res) => {
    try {
        const content = await injectNavigation(path.join(__dirname, 'pages', 'evaluation.html'));
        res.send(content);
    } catch (error) {
        res.status(500).send('Error loading page');
    }
});

// About page route (temporarily disabled)
/*
app.get('/about', async (req, res) => {
    try {
        const content = await injectNavigation(path.join(__dirname, 'pages', 'about.html'));
        res.send(content);
    } catch (error) {
        res.status(500).send('Error loading page');
    }
});
*/

app.get('/results', async (req, res) => {
    try {
        const content = await injectNavigation(path.join(__dirname, 'pages', 'results.html'));
        res.send(content);
    } catch (error) {
        res.status(500).send('Error loading page');
    }
});

// Schedule PDFs endpoint
app.get('/api/schedule-pdfs', (req, res) => {
    const schedulesDir = path.join(__dirname, 'schedules');
    fs.readdir(schedulesDir, (err, files) => {
        if (err) {
            console.error('Error reading schedules directory:', err);
            return res.status(500).json({ error: 'Error loading schedules' });
        }

        const pdfs = files
            .filter(file => file.toLowerCase().endsWith('.pdf'))
            .map(file => ({
                name: file,
                path: `/schedules/${file}`
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        res.json(pdfs);
    });
});

// Results visibility control
let resultsVisible = false;

app.get('/api/results-status', (req, res) => {
    res.json({ visible: resultsVisible });
});

app.post('/api/toggle-results', (req, res) => {
    if (req.body.adminKey === process.env.ADMIN_KEY) {
        resultsVisible = req.body.visible;
        res.json({ success: true, visible: resultsVisible });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Results data endpoint
app.get('/api/results', (req, res) => {
    if (!resultsVisible) {
        return res.status(403).json({ error: 'Results not yet available' });
    }
    
    // Placeholder results data
    const results = {
        winners: {
            first: { team: 'TBD', project: 'TBD' },
            second: { team: 'TBD', project: 'TBD' },
            third: { team: 'TBD', project: 'TBD' }
        },
        specialMentions: {
            innovative: 'TBD',
            technical: 'TBD',
            ux: 'TBD'
        },
        stats: {
            participants: 'TBD',
            projects: 'TBD',
            linesOfCode: 'TBD'
        }
    };
    
    res.json(results);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
