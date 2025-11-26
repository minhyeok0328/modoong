import type { Meta, StoryObj } from '@storybook/react';
import ReportPopup from './ReportPopup';
import { Provider, useSetAtom } from 'jotai';
import { reportPopupStateAtom } from '@/atoms/report';
import { useEffect } from 'react';

const PopupOpener = ({ children }: { children: React.ReactNode }) => {
    const setPopupState = useSetAtom(reportPopupStateAtom);
    useEffect(() => {
        setPopupState({ isOpen: true, facilityId: 'test-facility' });
    }, [setPopupState]);
    return <>{children}</>;
};

const meta: Meta<typeof ReportPopup> = {
    title: 'Common/Popup/ReportPopup',
    component: ReportPopup,
    decorators: [
        (Story) => (
            <Provider>
                <PopupOpener>
                    <Story />
                </PopupOpener>
            </Provider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof ReportPopup>;

export const Default: Story = {};
