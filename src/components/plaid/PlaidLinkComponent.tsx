import React, { useEffect } from 'react';
import { usePlaidLink, PlaidLinkOnSuccess } from 'react-plaid-link';
import { Button } from '../ui/button';
import { ChevronRight, Plus } from 'lucide-react';

interface PlaidLinkComponentProps {
    linkToken: string; // The link token passed from the backend
    onSuccess: PlaidLinkOnSuccess; // Success callback function
}

const PlaidLinkComponent: React.FC<PlaidLinkComponentProps> = ({ linkToken, onSuccess }) => {
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            console.log('Public Token:', public_token);
            console.log('Metadata:', metadata);
            onSuccess(public_token, metadata);
        },
        onExit: (exitError, metadata) => {
            if (exitError) console.error('Error:', exitError);
            console.log('Exit Metadata:', metadata);
        },
    });

    useEffect(() => {
        //if (ready) open(); // Automatically open Plaid Link when ready
    }, [open, ready]);

    // Wrap open in a proper event handler
    const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
        open();
    };

    return (
        <Button variant="outline" className="w-full justify-between" onClick={handleButtonClick} disabled={!ready}>
            <span className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Connect New Bank Account
            </span>
            <ChevronRight className="h-4 w-4" />
        </Button>
    );
};

export default PlaidLinkComponent;
