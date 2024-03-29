import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { snapshot, useSnapshot } from 'valtio'
import axios from 'axios';

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components'
import CanvasModel from '../canvas';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  //Show Tab Content depending on active tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />;
      case 'filepicker':
        return <FilePicker 
          file={file}
          setFile={setFile}
          generatingImg={generatingImg}
          readFile={readFile}
        />;
      case 'aipicker':
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />;
      default:
        return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert('Please enter a prompt');

    try {
      //Call backend to generate AI powered image
      setGeneratingImg(true);
      const response = await axios.post(
        "/api/dalle", {
        prompt: prompt,
        type: type,
      }, {
        headers: {
          'Content-Type': 'text/plain'
        }
      }).catch(function (error) {
        alert(error.response.data.error);
      });

      if(response){
        let data = await response.data.photo;
        handleDecals(type, `data:image/png;base64,${data}`);
      }
    } catch (error) {
        alert(error)
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const handleDownload = () => { 
    downloadCanvasToImage(CanvasModel.current);
  }

  const readFile = async (type) => {
    reader(file).then(async (result) => {
      try {
        //Call backend to generate AI powered image
        setGeneratingImg(true);
        const response = await axios.post(
          "/api/file", {
          image: result.split(',')[1],
          type: type,
        }, {
          headers: {
            'Content-Type': 'text/plain'
          }
        });

        let data = await response.data.photo;

        handleDecals(type, `data:image/png;base64,${data}`);
      } catch (error) {
        alert("Try with a different image");
      } finally {
        setGeneratingImg(false);
        setActiveEditorTab("");
      }
    });
  }

  const handleBack = () => {
    setActiveEditorTab("");
    state.intro = true;
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div 
            key="custom"
            className='absolute top-0 left-0 z-10'
            {...slideAnimation("left")}
          >
            <div className='flex items-center h-dvh'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab, index) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => activeEditorTab===tab.name
                      ? setActiveEditorTab("")
                      : setActiveEditorTab(tab.name)
                    }
                  />
                ))} 

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
          >
            <CustomButton
              type='filled'
              title='Go Back'
              handleClick={() => handleBack()}
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab, index) => (
              <Tab 
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => tab.name === "downlaod" ? handleDownload() : handleActiveFilterTab(tab.name)}
              />
            ))} 

            <Tab 
              key="download"
              tab={{
                name: "download",
                icon: download,
              }}
              isFilterTab
              isActiveTab={false}
              handleClick={() => handleDownload()}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer