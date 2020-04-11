import React, { useContext, useRef, ReactNode } from 'react';
import scrollToComponent from 'react-scroll-to-component';
import { isAndroid, isIOS } from 'react-device-detect';

// Local Modules
import AppContext from './AppContext';

// TS Props
interface Props {
    children?: ReactNode | null | undefined;
}

// The <Eventor /> Component
const Eventor: React.FC<Props> = ({ children }: Props): React.ReactElement => {
    // Context
    const [dataStore, setDataStore] = useContext<any>(AppContext);

    // Ref
    const hovRef: any = useRef<HTMLDivElement>(null);

    // Handler for hover
    const handleHover = e => {
        e.preventDefault();
        const { type } = e;

        // This is parent <li>
        const liParent = hovRef.current.offsetParent;

        // If already clicked, meaning the thumbnail has its
        // own unique design through .clicked class, then hover
        // is not needed anymore
        if (liParent.classList.contains('clicked')) {
            return null;
        }

        // Need to check type just to make sure
        if (type === 'mouseenter') {
            // Remove .hovered onmouseleave
            if (liParent.classList.contains('hovered')) {
                liParent.classList.remove('hovered');
            } else {
                // Then add onmouseenter
                liParent.classList.add('hovered');
            }
        } else {
            liParent.classList.remove('hovered');
        }

        return null;
    };

    // Handler for clicks
    const handleClick = async e => {
        e.preventDefault();
        // Destructure data store
        const { clickStat } = dataStore;
        // This is main parent containing all movies
        const mainParent = await hovRef.current.offsetParent.offsetParent.offsetParent.offsetParent;
        // This is the genre identifier div > id
        const identifierName = hovRef.current.offsetParent.offsetParent.offsetParent.firstChild.id;
        // Movie ID and trailer type
        const { movId, trailerType: tType } = await hovRef.current.firstChild.dataset;
        // This is parent <li>
        const liParent = await hovRef.current.offsetParent;
        // The li same as liParent above, but we need to traverse again for the .clicked
        const liElemToEdit: any = await mainParent.querySelectorAll('.clicked');
        // Distance from top
        // const elDistanceToTop = window.pageYOffset + liParent.getBoundingClientRect().top;

        // Auto scroll but only execute if 'upcoming' list cause there is a bug
        if (identifierName === 'upcoming') {
            await scrollToComponent(hovRef.current.offsetParent.offsetParent.offsetParent, {
                offset: 0,
                align: 'top',
                duration: 900,
                ease: 'inCirc',
            });
        } else if (isAndroid || isIOS) {
            await scrollToComponent(hovRef.current.offsetParent.offsetParent.offsetParent, {
                offset: 170,
                align: 'top',
                duration: 900,
                ease: 'inCirc',
            });
        } else {
            await scrollToComponent(hovRef.current.offsetParent.offsetParent.offsetParent, {
                offset: 270,
                align: 'middle',
                duration: 900,
                ease: 'inCirc',
            });
        }

        // If the clickStat is not empty
        // It means the user has already clicked another movie thumbnail
        if (clickStat !== '') {
            if (clickStat === movId) {
                // Set the new click stat
                await setDataStore({ ...dataStore, clickStat: '', trailerType: '', identifierWrapper: '' });

                try {
                    await liElemToEdit[0].classList.remove('clicked', 'hovered');
                } catch (e) {
                    console.log('Eventor: Error');
                    // Set the new click stat
                    await setDataStore({ ...dataStore, clickStat: '', trailerType: '', identifierWrapper: '' });
                }
            } else {
                // (img[data-mov-id="${CSS.escape(currentClick)}"]`) => just ignore this
                // Let's put it in a try/catch to prevent the app from crashing
                try {
                    // Anyway, this is where we remove the .clicked and .hovered classes
                    await liElemToEdit[0].classList.remove('clicked', 'hovered');

                    // Add .clicked to the current one
                    await liParent.classList.add('clicked');

                    // Set the new click stat
                    await setDataStore({
                        ...dataStore,
                        clickStat: movId,
                        trailerType: tType,
                        identifierWrapper: identifierName,
                    });
                } catch (e) {
                    console.log('Eventor: Error');
                    // Set the new click stat
                    await setDataStore({ ...dataStore, clickStat: '', trailerType: '', identifierWrapper: '' });
                }
            }
        } else {
            try {
                // Add .clicked class
                await liParent.classList.add('clicked');

                // Set the new click stat
                await setDataStore({
                    ...dataStore,
                    clickStat: movId,
                    trailerType: tType,
                    identifierWrapper: identifierName,
                });
            } catch (e) {
                console.log('Eventor: Error');
                // Set the new click stat
                await setDataStore({ ...dataStore, clickStat: '', trailerType: '', identifierWrapper: '' });
            }
        }
    };

    return (
        <div ref={hovRef} onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={handleClick}>
            {children}
        </div>
    );
};

export default Eventor;
