import React, { useState } from 'react'
import Analysis from "../pages/Analysis";
import Governance from '../pages/Governance';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';

const ProductTabs = () => {
    const panels = {
        "Automatic balancing": <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '6rem' }}>
                <Alert severity='info'>
                    Coming Soon
                </Alert>
            </div>
        </div>,
        "ReviFi Trading": <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '6rem' }}>
                <Alert severity='info'>
                    Coming Soon
                </Alert>
            </div>
        </div>,
        "ReviFi Wallets": <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '6rem' }}>
                <Alert severity='info'>
                    Coming Soon
                </Alert>
            </div>
        </div>,
        "Analysis": <Analysis />,
    }
    const [value, setValue] = useState(Object.keys(panels)[3]);
    const handleChange = (_, newValue) => {
        setValue(newValue);
    };
    return (
        <div>
            <div style={{ width: '100%' }}>
                <TabContext value={value}>
                    <Box sx={{
                        borderColor: 'divider', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1em',
                    }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example" style={{ borderRadius: '0.5em', backgroundColor: '#E6E6E6' }}>
                            {Object.keys(panels).map((panel, index) => (
                                <Tab className='' key={index} label={panel} value={panel} sx={{ backgroundColor: 'white', margin: '7px', borderRadius: '0.7em', border: '2px solid #0047AA' }} />
                            ))}
                        </TabList>
                    </Box>
                    {Object.keys(panels).map((panel, index) => (
                        <TabPanel key={index} value={panel}>
                            <div elevation={3} style={{ padding: '1em' }}>
                                {panels[panel]}
                            </div>
                        </TabPanel>
                    ))}
                </TabContext>
            </div>
        </div>
    )
}

export default ProductTabs;