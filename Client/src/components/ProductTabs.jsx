import React, { useState } from 'react';
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
            <div style={{ width: '100%', paddingTop: '0.5rem' }}>
                <TabContext value={value}>
                    <Box sx={{
                        borderColor: 'divider', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5em',
                    }}>
                        <TabList TabIndicatorProps={{ hidden: true }} onChange={handleChange} aria-label="lab API tabs example" style={{ borderRadius: '0.5em', backgroundColor: '#E6E6E6', padding: '0.2rem', fontSize: '0.8rem', minHeight: '30px' }} sx={{ "& button.Mui-selected": { border: '2px solid #0047AA', color: 'black' } }}>
                            {Object.keys(panels).map((panel, index) => (
                                <Tab className='' key={index} label={panel} value={panel} sx={{ margin: '3px', backgroundColor: 'white', borderRadius: '0.5em', minHeight: 'auto' }} />
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
                    {/* backgroundColor: 'white', borderRadius: '0.7em',   */}
                </TabContext>
            </div>
        </div>
    )
}

export default ProductTabs;
