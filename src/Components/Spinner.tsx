import React from 'react';
import styled from 'styled-components';
import BounceLoader from 'react-spinners/BounceLoader';

const Center = styled.div`
    margin: 0 auto !important;
    text-align: center !important;
    align-items: center !important;
    width: 100% !important;
`;

const Spinner = props => {
    return (
        <Center>
            <BounceLoader size={60} loading color="#123abc" />;
        </Center>
    );
};

export default Spinner;
