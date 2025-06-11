import React from 'react';
import { Box, Chip, Paper } from '@mui/material';

interface CategorySliderProps {
    categories: string[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
    categories,
    selectedCategory,
    onCategorySelect
}) => {
    return (
        <Paper 
            sx={{ 
                p: 2, 
                mb: 3, 
                display: 'flex',
                overflowX: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}
        >
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                    label="Tümü"
                    onClick={() => onCategorySelect('all')}
                    color={selectedCategory === 'all' ? 'primary' : 'default'}
                    variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                />
                {categories.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        onClick={() => onCategorySelect(category)}
                        color={selectedCategory === category ? 'primary' : 'default'}
                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default CategorySlider; 