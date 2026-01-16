import { styled } from '@mui/material';
import { Link as LinkComponent } from 'react-router-dom';
import { grayColor } from '../../constants/color';



export const VisuallyHiddenInput = styled('input')({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
});

export const Link = styled(LinkComponent)`

    text-decoration: none;
    color: inherit; 
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }`;
export const InputBox = styled("input")`
width:100%;
height:100%;
border:none;
outline:none;
padding:0 3rem;
border-radius: 1.5rem;
background-color: ${grayColor};
`;

export const SearchField = styled("input")`
width: 20vmax;
border: none;
outline: none;
padding: 1rem 2rem;
border-radius: 2rem;
background-color: ${grayColor};
&::placeholder {
    color: #999;
}   
&:focus {
    border: 1px solid #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
`;

export const CurveButton = styled("button")`
border: none;
outline: none;
padding: 1rem 2rem;
cursor: pointer;
font-size: 1rem;
color: white
border-radius: 2rem;
background-color: ${grayColor};
&:hover {
    background-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border: 2px solid #007bff;
}
`;

