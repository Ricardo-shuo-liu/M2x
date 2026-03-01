@logtitle
def test_clip():
    from m2x import clip
    import sys
    original_argv = sys.argv.copy()  
    sys.argv = ["m2x","-p","test.md","test.pdf"] 
    try:
        clip.main() 
    finally:
        sys.argv = original_argv  
        